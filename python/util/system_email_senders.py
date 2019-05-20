ORDERS = 1
INVOICES = 2
NOTIFICATIONS = 3

SENDER_STRINGS = {ORDERS: "orders",
                  INVOICES: "invoices",
                  NOTIFICATIONS: "notifications"}


def make_email_address(sender, email_store):
    """ Take a sender 'james' and a email store 'merchi.co'
        and then return an email address
    """
    return '{0} <{1}@{0}>'.format(email_store, sender)


def from_invoices(email_store):
    """ Return an email address from invoices@email_store """
    return make_email_address(SENDER_STRINGS[INVOICES], email_store)
