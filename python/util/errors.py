""" Specific error codes to report over the API when HTTP error codes are
    insufficiently granuluar.

    Existing codes should not be edited. Make a new one with a higher
    number if you need it.
"""

UNKNOWN_ERROR = 0  # default if there's nothing better
SERVER_ERROR = 1   # we crashed, nothing more the client should be told
CLIENT_ERROR = 2   # default if we only know that the user is at fault
EMAIL_ALREADY_EXISTS = 3
SUPPLIER_NOT_ADDED_TO_PRODUCT = 4
EMAIL_NOT_FOUND = 5
INVALID_PHONE_NUMBER = 6
INVALID_PASSWORD = 7
RESOURCE_NOT_FOUND = 8  # i.e. HTTP 404
RESOURCE_GONE = 9  # a requested object has been deleted (i.e. HTTP 410)
REQUEST_TOO_LARGE = 10  # too many bytes sent or too complex a query
UNKNOWN_DOMAIN = 11  # request comes from a domain that is not allowed
UNSUPPORTED_METHOD = 12 # i.e. HTTP 405

# the following are websocket related
MISSING_EVENT_TYPES = 13
INVALID_EVENT_TYPES = 14
MISSING_URI = 15
MISSING_SID = 16
MISSING_SECRET_KEY = 17
MISSING_SUBSCRIPTION_TOKEN = 18
WRONG_SECRET_KEY = 19
DUPLICATE_SUBSCRIPTION_TOKEN = 20

BAD_SMS_TOKEN = 21
DOMAIN_NOT_FOUND = 22  # operation tried with non existing domain
