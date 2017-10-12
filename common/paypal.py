import urllib.parse
import requests


def parse_nvp_response(response):
    """ Paypal NVP returns a URL encoded key-value pair string in it's API
        responses. This function thats that strict as an argument and parses
        it into a dict.
    """
    return urllib.parse.parse_qs(response.text)


def approve_url(token):
    """ Return a URL at which a user may approve a PayPal payment for the
        given transaction.
    """
    url = "https://www.paypal.com/cgi-bin/webscr?" \
          "cmd=_express-checkout&token={}"
    return url.format(token)


def make_nvp_request(data):
    """ Make an NVP API request against the PayPal endpoint. Requires a dict of
        key-value pairs as it's argument.
    """
    response = requests.post("https://api-3t.paypal.com/nvp", data=data)
    return parse_nvp_response(response)


def create_payment_request(paypal_account, paypal_password, paypal_signature,
                           success, error, amount, currency="AUD"):
    """ Calling this function registers a request for payment with paypal.
        It neither authorises nor carries out nor completes the transaction,
        it simply let's paypal know that this is a type of transaction that we
        would be interested in making. In the dict that is returned by this
        function is a "token" parameter, which can be used to refer to the
        transaction in the future, and, in particular, is required to redirect
        users to the PayPal website in order for them to authorise the payment.
        The token is timelimited to 3 hours at the time of writing.
    """
    data = {"USER": paypal_account,
            "PWD": paypal_password,
            "SIGNATURE": paypal_signature,
            "METHOD": "SetExpressCheckout",
            "VERSION": "93",
            "NOSHIPPING": "1",
            "PAYMENTREQUEST_0_PAYMENTACTION": "SALE",
            "PAYMENTREQUEST_0_AMT": round(amount, 2),
            "PAYMENTREQUEST_0_CURRENCYCODE": currency,
            "RETURNURL": success,
            "CANCELURL": error}
    return make_nvp_request(data)


def is_valid_credentials(paypal_account, paypal_password, paypal_signature):
    """ Return True if it is possible to request a payment using the
        provided credentials.
    """
    # any url that paypal thinks is valid-looking can be used here
    reply_uri = "http://example.com/unused/"
    response = create_payment_request(paypal_account, paypal_password,
                                      paypal_signature, reply_uri, reply_uri,
                                      1)
    try:
        response["TOKEN"][0]
    except KeyError:
        return False
    return True


def get_payment_details(paypal_account, paypal_password, paypal_signature,
                        payment_token):
    """ Given a token refering to a transaction, this function will make a
        PayPal API request to fetch the details of the transaction including
        currency and amount, and return the results in a dict.
    """
    data = {"USER": paypal_account,
            "PWD": paypal_password,
            "SIGNATURE": paypal_signature,
            "METHOD": "GetExpressCheckoutDetails",
            "VERSION": "93",
            "TOKEN": payment_token}
    return make_nvp_request(data)


def complete_payment(paypal_account, paypal_password, paypal_signature,
                     payment_token, payer_id, amount, currency="AUD"):
    """ Calling this function with a valid payment_token will cause the
        transaction to actually be carried out and completed. In order for
        this to work, the payer must first have authorised the transaction,
        by visitng the URL returned by approve_url()
    """
    data = {"USER": paypal_account,
            "PWD": paypal_password,
            "SIGNATURE": paypal_signature,
            "METHOD": "DoExpressCheckoutPayment",
            "VERSION": "93",
            "TOKEN": payment_token,
            "PAYERID": payer_id,
            "PAYMENTREQUEST_0_PAYMENTACTION": "SALE",
            "PAYMENTREQUEST_0_AMT": round(amount, 2),
            "PAYMENTREQUEST_0_CURRENCYCODE": currency}
    return make_nvp_request(data)
