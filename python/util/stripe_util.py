import stripe


def is_valid_key(x):
    """ Return True is valid stripe api key is given. """
    stripe.api_key = x
    try:
        stripe.Charge.list(limit=0)
    except stripe.error.AuthenticationError:
        return False
    return True
