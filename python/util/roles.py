""" Defines the types ("roles") of user accounts that can exist
    in the system. The information is stored per user as user.role. The role of
    the logged in user making a request is used by the permissions system and
    impacts the data that the user is allowed to access, as well as, in some
    cases, the layout of the page that they see on the frontend. The roles
    themselves are defined as integer constants due to python's lack of an
    enumeration type.
"""

# a system role who is responding build all system templates componets
SYSTEM_COMPONENT_BUILDER = 1

SYSTEM_ROLE_STRINGS = {
    SYSTEM_COMPONENT_BUILDER: "Component builder",
}

PUBLIC = 0
ADMIN = 1
SALES = 2
DESIGNER = 3
SUPPLIER = 4
CLIENT = 5
MANAGER = 6
ACCOUNTANT = 7
THEME_EDITOR = 8

ROLE_STRINGS = {PUBLIC: "public",
                ADMIN: "admin",
                SALES: "sales",
                DESIGNER: "designer",
                SUPPLIER: "supplier",
                CLIENT: "client",
                MANAGER: "manager",
                ACCOUNTANT: "accountant",
                THEME_EDITOR: "theme editor"}

ROLE_CSS_CLASS = {PUBLIC: "default",
                  ADMIN: "inverse",
                  SALES: "success",
                  DESIGNER: "success",
                  SUPPLIER: "warning",
                  CLIENT: "danger",
                  MANAGER: "primary",
                  ACCOUNTANT: 'info',
                  THEME_EDITOR: "success"}


ROLE_INTS = {v: k for k, v in ROLE_STRINGS.items()}

# users who are in the management team of the domain
MANAGEMENT_ROLES = {SALES, DESIGNER, MANAGER, ACCOUNTANT, ADMIN}

# users who have works with the domain but are not one of the management team
DOMAIN_WORKERS = {SUPPLIER, THEME_EDITOR}

# users who are involved as business parties
BUSINESS_ACCOUNTS = MANAGEMENT_ROLES.copy()
BUSINESS_ACCOUNTS.update(DOMAIN_WORKERS)

# all registered user type
ACCOUNTS = BUSINESS_ACCOUNTS.copy()
ACCOUNTS.add(CLIENT)

ALL_ROLES = ACCOUNTS.copy()
ALL_ROLES.add(PUBLIC)

SYSTEM_SECTION = {ADMIN}
USER_SECTION = {ADMIN}
INFO_SECTION = ACCOUNTS.copy()
INFO_SECTION.add(PUBLIC)

DESIGN_SECTION = {ADMIN, MANAGER, DESIGNER, CLIENT, PUBLIC}
PRODUCTION_SECTION = {ADMIN, MANAGER, SUPPLIER}
SHIPPING_SECTION = {ADMIN, MANAGER, CLIENT}

ALLOWED_SIGN_UP_ROLES = (DESIGNER, CLIENT, SUPPLIER)

INVOICE_ROLES = {ADMIN, MANAGER, ACCOUNTANT}

JOB_INFO_ROLES = {ADMIN, DESIGNER, MANAGER}


def role_string(role_code):
    """ Given integer role_code denoting a users role, return a lower case
        string naming that role. Defaults to 'public' if the code is not
        known.
    """
    try:
        return ROLE_STRINGS[role_code]
    except KeyError:
        return "public"


OPTIONS_ORDER = [CLIENT, SUPPLIER, SALES, DESIGNER, MANAGER, ADMIN, ACCOUNTANT]

MANAGER_OPTIONS_ORDER = [CLIENT, SUPPLIER, DESIGNER, MANAGER]

ROLE_OPTIONS = [(role, role_string(role)) for role in OPTIONS_ORDER]

MANAGER_ROLE_OPTIONS = [(role, role_string(role)) for role in
                        MANAGER_OPTIONS_ORDER]

ROLE_PRIORITY_RANK = [
    ADMIN, MANAGER, ACCOUNTANT, DESIGNER, SALES, SUPPLIER, CLIENT, PUBLIC
]

ROLE_PRIORITIES = {role: i for i, role in enumerate(ROLE_PRIORITY_RANK)}
