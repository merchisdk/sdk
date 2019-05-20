import datetime
import sdk.python.entities
from sdk.python.payments import Payment
from sdk.python.items import Item
from sdk.python.addresses import Address
from sdk.python.stores import Store
from sdk.python.store_tags import StoreTag
from sdk.python.users import User
from sdk.python.files import File
from sdk.python.companies import Company
from sdk.python.phone_numbers import PhoneNumber
from sdk.python.email_addresses import EmailAddress
from sdk.python.util.money_protocol import format_currency
import sdk.python.util.invoice_status
from sdk.python.entities import Property


class Invoice(sdk.python.entities.Entity):

    resource = '/invoices/'
    json_name = 'invoice'

    note = Property(str)
    creation_date = Property(datetime.datetime)
    payment_deadline = Property(datetime.datetime)
    reminded = Property(datetime.datetime)
    archived = Property(datetime.datetime)
    id = Property(int)
    send_sms = Property(bool)
    send_email = Property(bool)
    unpaid = Property(bool)
    accept_stripe = Property(bool)
    accept_paypal = Property(bool)
    accept_bank_transfer = Property(bool)
    accept_phone_payment = Property(bool)
    is_remindable = Property(bool)
    force_reminders = Property(bool)
    total_cost = Property(float)
    subtotal_cost = Property(float)
    tax_amount = Property(float)
    currency = Property(str)
    invoice_token = Property(str)
    reminder_message = Property(str)
    responsible_manager = Property(User)
    creator = Property(User)
    client = Property(User)
    client_phone = Property(PhoneNumber)
    client_email = Property(EmailAddress)
    client_company = Property(Company)
    client_company_phone = Property(PhoneNumber)
    client_company_email = Property(EmailAddress)
    items = Property(Item, backref="invoice")
    shipping = Property(Address)
    store = Property(Store)
    pdf = Property(File)
    receipt = Property(File)
    payments = Property(Payment, backref="invoice")
    tags = Property(StoreTag, backref="invoices")

    def process_for_transfer(self):
        # can not update product by updating invoice
        # will have better solution later
        if self.jobs:
            for job in self.jobs:
                job.product = None

    def amount_paid(self):
        """ Return how much money has been paid for this invoice """
        if isinstance(self.payments, list):
            return sum([payment.amount for payment in self.payments])
        return 0

    def amount_owed(self):
        """ Return how much money still owed for this invoice """
        total = self.total_cost
        if self.amount_paid():
            return total - self.amount_paid()
        return total

    def amount_owed_formated_with_currency(self):
        """ Return a formatted amount owed including the currency
            icon at the start of the value.
        """
        return format_currency(self.amount_owed(), 2, self.currency)

    def invoice_payment_status(self):
        # This method returns the payment status of the invoice
        total_payments = \
            sum([payment.amount for payment in self.payments])
        if total_payments < 0:
            return sdk.python.util.invoice_status.NEGATIVE_PAYMENT
        elif total_payments == 0:
            return sdk.python.util.invoice_status.NO_PAYMENT
        elif self.total_cost == total_payments:
            return sdk.python.util.invoice_status.FULL_PAYMENT
        elif self.total_cost > total_payments:
            return sdk.python.util.invoice_status.PART_PAYMENT
        return sdk.python.util.invoice_status.OVER_PAYMENT

    def is_paid_string(self):
        """ Return a string 'Unpaid' if the invoice is unpaid
            else return a string 'Paid'.
        """
        if self.unpaid:
            return "Unpaid"
        return "Paid"


class Invoices(sdk.python.entities.Resource):

    entity_class = Invoice
    json_name = 'invoices'


invoices = Invoices()
