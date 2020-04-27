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
UNSUPPORTED_METHOD = 12  # i.e. HTTP 405

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

# this happens if for example the user tries to provide a string when
# a number is expected
TYPE_ERROR = 23

# trying to unarchive a non-archived entity
NOT_ARCHIVED = 24

# the following mean bad values where given to the analytics endpoint
MISSING_CURRENCY_FILTER = 25
INVALID_AGGREGATE = 26
MISSING_INDEPENDENT = 27
INVALID_DEPENDENT = 28
INVALID_INDEPENDENT = 29
MISSING_DEPENDENT = 30

BAD_INVOICE_TOKEN = 31
MISSING_RELATED_FILTER = 32
RATE_LIMITED = 33  # try again later
INVOICE_UNPAID = 34
MISSING_JOB_SECTION = 35
MISSING_PRODUCT_ID = 36
MISSING_QUANTITY = 37
BAD_PAYMENT_AMOUNT = 38
ALREADY_PAID = 39
CARD_PAYMENT_FAILED = 40

JSONP_MISSING_RESOURCE = 41
JSONP_MISSING_PADDING = 42
JSONP_MISSING_METHOD = 43
JSONP_INVALID = 44

MISSING_CLIENT = 45
MISSING_EMAIL = 46
MISSING_NAME = 47
MISSING_PASSWORD = 48
INVALID_TOKEN = 49
MISSING_COMPANY = 50
MISSING_SUPPLIER = 51
BAD_ROLE = 52
ALREADY_INVITED = 53
MISSING_TOKEN = 54

MISSING_ADDRESS_LINE_ONE = 55
MISSING_ADDRESS_LINE_TWO = 56
MISSING_CITY = 57
MISSING_POSTCODE = 58
MISSING_COUNTRY = 59
MISSING_STATE = 60

# shipments
NOT_RESPONSIBLE = 61
HAS_JOBS = 62
HAS_ASSIGNMENTS = 63
UNSET_SHIPMENT = 64

MISSING_SUBDOMAIN = 65
NO_CSS_FILE = 66  # cannot use this theme
MUST_LOGIN = 67  # protected resource, login first
FORBIDDEN = 68  # user is logged in, but requested something they can't use
INVALID_JSON = 69
UNLINKED_COMMENT = 70  # cannot find a job for the comment
MISSING_FILE = 71
DUPLICATE_INVENTORY = 72
BAD_LANGUAGE = 73
BAD_TIMEZONE = 74
MISSING_DOMAIN = 75
BAD_DOMAIN = 76
BAD_TRACKING_CODE = 77
DISCOUNT_LESS_THAN_MINIMUM = 78
DISCOUNT_TOO_LARGE = 79
ALREADY_ASSIGNED = 80
TOO_LATE = 81
BAD_COMPANY = 82
TOO_MANY_DEFAULTS = 83
MISSING_DRAFT = 84
BAD_ASSIGNMENT = 85
BAD_COUNTRY = 86
UNLINKED_INVOICE = 87  # no jobs or items
NO_PAYMENT_METHOD = 88
BAD_TEMPLATE = 89
MISSING_ADDRESS = 90
BAD_NAME = 91

MISSING_ADMIN = 92  # company admin not defined
MISSING_BANK = 93
MISSING_PHONE = 94
MISSING_PAYPAL = 95
MISSING_STRIPE = 96

NO_SUCH_RELATION = 97  # tried to embed something that doesn't exist
DUPLICATE_DATA = 98
NO_DATA = 99  # client didn't send anything
MISSING_PRIMARY = 100  # at least one thing must exist, and be marked as primary

NOT_SELECTABLE = 101  # tried to choose options on something with none
TOO_MANY_SELECTIONS = 102  # only one option may be chosen
NOT_ENOUGH_SELECTIONS = 103  # must choose one option
UNSUPPORTED_FILTER = 104
CONFLICT = 105  # e.g. username or email or domain already exists
MISSING_AS_ADMIN = 106
MISSING_INVITATION_TOKEN = 107
MISSING_STORE_NAME = 108
BAD_TOKEN = 109

BAD_CART_TOKEN = 110

STATE_WITHOUT_COUNTRY = 111

BAD_SLUG = 112  # provided value that cannot be used in url

NO_DOMAIN_MANAGER = 113  # domain does not have either admin or manager
