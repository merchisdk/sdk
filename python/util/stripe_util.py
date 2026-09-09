import stripe


def is_valid_key(x):
    """Return True if a valid Stripe secret API key is given."""
    if not x or str(x).startswith("pk_"):
        return False
    stripe.api_key = x
    try:
        stripe.Charge.list(limit=1)
    except stripe.error.StripeError:
        return False
    return True
