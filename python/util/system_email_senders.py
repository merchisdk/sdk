ORDERS = 1
INVOICES = 2
NOTIFICATIONS = 3

SENDER_STRINGS = {ORDERS: "orders",
                  INVOICES: "invoices",
                  NOTIFICATIONS: "notifications"}


def make_email_address(sender, email_domain):
    """ Take a sender 'james' and a email store 'merchi.co'
        and then return an email address
    """
    return '{0} <{1}@{0}>'.format(email_domain, sender)


def from_invoices(email_domain):
    """ Return an email address from invoices@email_domain """
    return make_email_address(SENDER_STRINGS[INVOICES], email_domain)
