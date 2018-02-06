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
