import sdk.python.util.roles as roles

SYSTEM = 0
USER = 1
JOB_INFO = 2
JOB_DRAFTING = 3
JOB_PRODUCTION = 4
JOB_INVOICING = 5
JOB_SHIPPING = 6
INVOICE = 7
JOB_NOTIFICATIONS = 8
REMINDER = 9
WEB_FORM = 10

SECTION_ICON_CLASS = {SYSTEM: "fa fa-server",
                      USER: "icon_m_single_user",
                      JOB_INFO: "icon_m_info",
                      JOB_DRAFTING: "icon_m_design",
                      JOB_PRODUCTION: "icon_m_manufacturing",
                      JOB_INVOICING: "icon_m_invoice",
                      JOB_SHIPPING: "icon_m_shipping",
                      INVOICE: 'icon_m_invoice',
                      REMINDER: 'icon_m_reminder'}

SECTION_CLASS_NAME = {SYSTEM: "default",
                      USER: "danger",
                      JOB_INFO: "inverse",
                      JOB_DRAFTING: "success",
                      JOB_PRODUCTION: "warning",
                      JOB_INVOICING: "primary",
                      JOB_SHIPPING: "info",
                      INVOICE: 'primary',
                      REMINDER: 'default'}

JOB_SECTION_STRINGS = {SYSTEM: "system",
                       USER: "user",
                       JOB_INFO: "info",
                       JOB_DRAFTING: "design",
                       JOB_PRODUCTION: "production",
                       JOB_INVOICING: "invoicing",
                       JOB_SHIPPING: "shipping",
                       INVOICE: 'invoice',
                       REMINDER: 'reminder'}


def section_string(section_code):
    """ Given integer section_code denoting the job section, return a
        lower case string naming that section. Defaults to 'system'
        if the code is not known.
    """
    return JOB_SECTION_STRINGS.get(section_code, "system")


# options needed for common users
OPTIONS_ORDER_COMMON = [USER, JOB_INFO, JOB_DRAFTING, JOB_PRODUCTION,
                        JOB_INVOICING, JOB_SHIPPING, INVOICE, REMINDER]

OPTIONS_ORDER_SUPER = OPTIONS_ORDER_COMMON.copy()
OPTIONS_ORDER_SUPER.append(SYSTEM)

SECTION_OPTIONS_COMMON =\
    [(section, section_string(section)) for section in OPTIONS_ORDER_COMMON]

SECTION_OPTIONS_SUPER =\
    [(section, section_string(section)) for section in OPTIONS_ORDER_SUPER]

""" this dictionary are used to check whether user with
    certain role have permission to write the notification
    of certain section
"""
section_roles = \
    {JOB_INFO: roles.INFO_SECTION,
     JOB_DRAFTING: roles.DESIGN_SECTION,
     JOB_PRODUCTION: roles.PRODUCTION_SECTION,
     JOB_SHIPPING: roles.SHIPPING_SECTION,
     SYSTEM: roles.SYSTEM_SECTION,
     USER: roles.USER_SECTION}
