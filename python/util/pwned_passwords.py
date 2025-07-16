""" Utilities for checking whether a given password has been compromised using
    the HaveIBeenPwned API with proper caching to avoid repeated API calls.

    This module integrates with the HaveIBeenPwned Pwned Passwords API using
    the k-anonymity model, which means only the first 5 characters of the
    SHA-1 hash are sent to the API, ensuring the actual password is never
    transmitted.

    The practice of checking passwords against breach databases is supported by
    NIST Special Publication 800-63-3: Digital Authentication Guidelines.

    Key features:
    - Uses HaveIBeenPwned Pwned Passwords API v3
    - Implements Redis caching to minimize API calls
    - k-anonymity approach for privacy protection
    - Graceful degradation on API failures
    - Configurable cache TTL

    The main interface is `is_password_pwned`, which returns True if the
    password has been found in data breaches, False otherwise.
"""
import hashlib
import logging
import requests
import redis
from typing import Optional


# Redis connection for caching (using db=3 to avoid conflicts with existing usage)
cache = redis.Redis(host='redis', port=6379, db=3)

# Cache settings
CACHE_TTL = 86400  # 24 hours in seconds
PWNED_PASSWORD_CACHE_PREFIX = "pwned_password:"
HASH_PREFIX_CACHE_PREFIX = "pwned_prefix:"

# API settings
HIBP_API_URL = "https://api.pwnedpasswords.com/range/"
API_TIMEOUT = 5  # seconds
MAX_RETRIES = 2

# Logging
logger = logging.getLogger(__name__)

# Test configuration - set this in test environments
_TEST_MODE = False
_TEST_PWNED_PASSWORDS = set()  # Set of passwords to treat as pwned in test mode


def _sha1_hash(password: str) -> str:
    """Generate SHA-1 hash of the password in uppercase."""
    return hashlib.sha1(password.encode('utf-8')).hexdigest().upper()


def _get_hash_prefix_and_suffix(password_hash: str) -> tuple[str, str]:
    """Split SHA-1 hash into 5-character prefix and the rest."""
    return password_hash[:5], password_hash[5:]


def _query_hibp_api(hash_prefix: str) -> Optional[dict[str, int]]:
    """
    Query the HaveIBeenPwned API for hash suffixes matching the prefix.

    Returns:
        Dictionary mapping hash suffixes to occurrence counts, or None on failure
    """
    try:
        response = requests.get(
            f"{HIBP_API_URL}{hash_prefix}",
            timeout=API_TIMEOUT,
            headers={'User-Agent': 'Merchi Password Validator'}
        )
        response.raise_for_status()

        # Parse the response - format is "HASHSUFFIX:COUNT"
        hash_counts = {}
        for line in response.text.strip().split('\n'):
            if ':' in line:
                hash_suffix, count = line.split(':', 1)
                hash_counts[hash_suffix] = int(count)

        return hash_counts

    except requests.exceptions.RequestException as e:
        logger.warning(f"Failed to query HaveIBeenPwned API for prefix {hash_prefix}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error querying HaveIBeenPwned API: {e}")
        return None


def _get_cached_hash_prefixes(hash_prefix: str) -> Optional[dict[str, int]]:
    """Get cached hash prefixes data from Redis."""
    try:
        cache_key = f"{HASH_PREFIX_CACHE_PREFIX}{hash_prefix}"
        cached_data = cache.get(cache_key)
        if cached_data:
            # Parse cached data back to dictionary
            hash_counts = {}
            for line in cached_data.decode('utf-8').split('\n'):
                if ':' in line:
                    hash_suffix, count = line.split(':', 1)
                    hash_counts[hash_suffix] = int(count)
            return hash_counts
    except Exception as e:
        logger.warning(f"Failed to retrieve cached data for prefix {hash_prefix}: {e}")
    return None


def _cache_hash_prefixes(hash_prefix: str, hash_counts: dict[str, int]) -> None:
    """Cache hash prefixes data in Redis."""
    try:
        cache_key = f"{HASH_PREFIX_CACHE_PREFIX}{hash_prefix}"
        # Convert dictionary back to HIBP API format for caching
        cache_data = '\n'.join(f"{suffix}:{count}" for suffix, count in hash_counts.items())
        cache.setex(cache_key, CACHE_TTL, cache_data)
    except Exception as e:
        logger.warning(f"Failed to cache data for prefix {hash_prefix}: {e}")


def _get_cached_password_result(password_hash: str) -> Optional[bool]:
    """Get cached result for a specific password hash."""
    try:
        cache_key = f"{PWNED_PASSWORD_CACHE_PREFIX}{password_hash}"
        cached_result = cache.get(cache_key)
        if cached_result is not None:
            return cached_result.decode('utf-8') == 'True'
    except Exception as e:
        logger.warning(f"Failed to retrieve cached password result: {e}")
    return None


def _cache_password_result(password_hash: str, is_pwned: bool) -> None:
    """Cache the result for a specific password hash."""
    try:
        cache_key = f"{PWNED_PASSWORD_CACHE_PREFIX}{password_hash}"
        cache.setex(cache_key, CACHE_TTL, str(is_pwned))
    except Exception as e:
        logger.warning(f"Failed to cache password result: {e}")


def set_test_mode(enabled: bool = True, pwned_passwords: list[str] = None) -> None:
    """
    Configure test mode for password validation.

    Args:
        enabled: Whether to enable test mode
        pwned_passwords: List of passwords to treat as pwned in test mode
    """
    global _TEST_MODE, _TEST_PWNED_PASSWORDS
    _TEST_MODE = enabled
    if pwned_passwords:
        _TEST_PWNED_PASSWORDS = set(pwned_passwords)
    else:
        _TEST_PWNED_PASSWORDS = set()


def is_password_pwned(password: str, fallback_on_error: bool = False) -> bool:
    """
    Check if a password has been found in data breaches using HaveIBeenPwned API.

    Args:
        password: The password to check
        fallback_on_error: If True, returns False when API is unavailable.
                          If False, returns True (more secure) when API fails.

    Returns:
        True if password is known to be compromised, False otherwise.

    Note:
        A False return value does not guarantee the password is safe,
        merely that it hasn't been found in known breach databases.
    """
    if password is None or password == '' or password.strip() == '':
        return True

    # In test mode, use predefined pwned passwords
    if _TEST_MODE:
        # Check both exact match and case-insensitive match for test compatibility
        return password in _TEST_PWNED_PASSWORDS or password.lower() in {
            p.lower() for p in _TEST_PWNED_PASSWORDS}

    password_hash = _sha1_hash(password)

    # Check if we have a cached result for this exact password
    cached_result = _get_cached_password_result(password_hash)
    if cached_result is not None:
        return cached_result

    hash_prefix, hash_suffix = _get_hash_prefix_and_suffix(password_hash)

    # Try to get cached data for this hash prefix
    hash_counts = _get_cached_hash_prefixes(hash_prefix)

    # If not cached, query the API
    if hash_counts is None:
        hash_counts = _query_hibp_api(hash_prefix)

        # If API call failed, use fallback behavior
        if hash_counts is None:
            if fallback_on_error:
                logger.info("HaveIBeenPwned API unavailable, allowing password (fallback mode)")
                return False
            else:
                logger.warning("HaveIBeenPwned API unavailable, rejecting password for security")
                return True

        # Cache the API response
        _cache_hash_prefixes(hash_prefix, hash_counts)

    # Check if our hash suffix is in the results
    is_pwned = hash_suffix in hash_counts

    # Cache the result for this specific password
    _cache_password_result(password_hash, is_pwned)

    if is_pwned:
        count = hash_counts[hash_suffix]
        logger.info(f"Password found in {count} breaches")

    return is_pwned


def clear_password_cache() -> None:
    """Clear all cached password data. Useful for testing or cache management."""
    try:
        # Get all keys matching our cache prefixes
        password_keys = cache.keys(f"{PWNED_PASSWORD_CACHE_PREFIX}*")
        prefix_keys = cache.keys(f"{HASH_PREFIX_CACHE_PREFIX}*")

        all_keys = password_keys + prefix_keys
        if all_keys:
            cache.delete(*all_keys)
            logger.info(f"Cleared {len(all_keys)} cached password entries")
    except Exception as e:
        logger.warning(f"Failed to clear password cache: {e}")


# Backward compatibility alias
is_password_known_bad = is_password_pwned
