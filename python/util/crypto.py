import datetime
import random
import ssl
import base64
import string
import binascii
import scrypt
import OpenSSL

DIGEST_LEN = 128
# sms token short because it can only ever be checked once and if the supplied
# sms_token does not match the user.sms_token, user.sms_token is set to None
SMS_TOKEN_LEN = 36
SMS_CLIENT_TOKEN_LEN = 512

# the system should require that all new passwords have at least this many
# characters. this value should not be checked against login attempts (other
# than perhaps to suggest changing passwords), because pre-existing passwords
# must be grandfathered in to prevent accounts becoming inaccessible.
# the value of 8 is chosen as per "NIST Special Publication 800-63B", refered
# to in that document as "memorized secrets".
SHORTEST_NEW_PASSWORD = 8


# Streching (sometimes called "hashing") a password prior to storage is an
# intentionally computationally expensive task. The scrypt algorithm we use
# for the task has no natural upper bound on the length of its input. Without
# this parameter, which limits the largest password that we accept, a denial
# of service attack could be launched by simply making login or password
# change/set attempts repeatedly, password lengths as large as the maximum
# request size that the server allows. Supplying random passwords in that
# manner would be easy for the attacker, but the CPU and memory usage on
# the server would be large, making it possible for a relatively small
# attacker to take the CPU to 100% usage. "NIST Special Publication 800-63B"
# specifies that a minium length of 64 be supported for "memorized secrets".
# For future proofing, and in recognition that for those users that employ
# password managers, their password is more akin to a symetric secret key
# than a memorised secret, we are a little more generous.
MAX_PASSWORD_LENGTH = 256


def random_token(length, upper=True, lower=True, digits=True):
    """ Produce a cryptographically secure pseudorandom token composed of
        a uniformly distributed sequence of ASCII uppercase letters, lowercase
        letters and digits.

        Args:
          length (int): number of characters to return
          upper (bool): include uppercase letters
          lower (bool): include lowercase letters
          digits (bool): include digits
    """
    chars = ''
    if upper:
        chars += string.ascii_uppercase
    if lower:
        chars += string.ascii_lowercase
    if digits:
        chars += string.digits
    chooser = random.SystemRandom()

    def random_char():
        return chooser.choice(chars)
    return ''.join((random_char() for i in range(0, length)))


def base64encode(code):
    """ Encode code to base64 format and force them into
        str
    """
    return base64.b64encode(code).decode()


def token_to_str(token_bytes):
    r""" Convert bytestring to a URL and filename safe str.

        Encodes using base64, with alternative characters for \ and +,
        and padding stripped. It is intended that this encoding be used to
        send secret tokens etc. across the wire with transports that do not
        support arbitrary byte strings.
    """
    encoded = base64.b64encode(token_bytes, altchars=b"-_")
    without_padding = encoded.rstrip(b'=')
    return without_padding.decode('ascii')


def str_to_token(encoded_token):
    """ Convert an encoded str token into a bytestring.

        This is the reverse operation of `token_to_str`.
    """
    token_bytes = encoded_token.encode('ascii')
    padded = token_bytes + b'==='
    try:
        return base64.b64decode(padded, altchars=b"-_")
    except binascii.Error:
        raise ValueError


def hash_password(password, salt):
    password = password.encode('utf-8')
    return scrypt.hash(password, salt, buflen=DIGEST_LEN)


def get_https_expiry(host):
    """ Return the expiry date of any HTTPS certificate presented by the given
        host on port 443 as a datetime.datetime object.
    """
    cert = ssl.get_server_certificate((host, 443))
    load_cert = OpenSSL.crypto.load_certificate  # type: ignore
    pem = OpenSSL.crypto.FILETYPE_PEM  # type: ignore
    x509 = load_cert(pem, cert)
    expires = x509.get_notAfter().decode('UTF-8')
    return datetime.datetime.strptime(expires, "%Y%m%d%H%M%SZ")


def hash(string):
    """ Hash a string using scrypt.

        Args:
          string (str): string to be hashed

        Returns:
          str: hashed string
    """
    return scrypt.hash(
        string.encode('utf-8'), buflen=DIGEST_LEN, salt=b'merchi')
