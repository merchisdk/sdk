import datetime
import sdk.python.entities
import sdk.python.jobs
from sdk.python.payments import Payment
from sdk.python.items import Item
from sdk.python.addresses import Address
from sdk.python.domains import Domain
from sdk.python.users import User
from sdk.python.files import File
from sdk.python.companies import Company
from sdk.python.phone_numbers import PhoneNumber
from sdk.python.email_addresses import EmailAddress
from common.money_protocol import format_currency
import common.invoice_status


class Invoice(sdk.python.entities.Entity):

    resource = '/invoices/'
    json_name = 'invoice'

    def __init__(self):
        super(Invoice, self).__init__()
        self.json_property(str, 'note')
        self.json_property(datetime.datetime, 'creation_date')
        self.json_property(datetime.datetime, 'payment_deadline')
        self.json_property(datetime.datetime, 'reminded')
        self.json_property(int, 'id')
        self.json_property(bool, 'send_sms')
        self.json_property(bool, 'send_email')
        self.json_property(bool, 'unpaid')
        self.json_property(bool, 'accept_stripe')
        self.json_property(bool, 'accept_paypal')
        self.json_property(bool, 'accept_bank_transfer')
        self.json_property(bool, 'accept_phone_payment')
        self.json_property(bool, 'is_remindable')
        self.json_property(bool, 'force_reminders')
        self.json_property(float, 'total_cost')
        self.json_property(float, 'subtotal_cost')
        self.json_property(float, 'tax_amount')
        self.json_property(str, 'currency')
        self.json_property(str, 'invoice_token')
        self.json_property(str, 'reminder_message')
        self.recursive_json_property(User, 'responsible_manager')
        self.recursive_json_property(User, 'creator')
        self.recursive_json_property(User, 'client')
        self.recursive_json_property(PhoneNumber, 'client_phone')
        self.recursive_json_property(EmailAddress, 'client_email')
        self.recursive_json_property(sdk.python.jobs.Job, 'jobs')
        self.recursive_json_property(Company, 'client_company')
        self.recursive_json_property(PhoneNumber, 'client_company_phone')
        self.recursive_json_property(EmailAddress, 'client_company_email')
        self.recursive_json_property(Item, 'items')
        self.recursive_json_property(Address, 'shipping')
        self.recursive_json_property(Domain, 'domain')
        self.recursive_json_property(File, 'pdf')
        self.recursive_json_property(File, 'receipt')
        self.recursive_json_property(Payment, 'payments')

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
            return common.invoice_status.NEGATIVE_PAYMENT
        elif total_payments == 0:
            return common.invoice_status.NO_PAYMENT
        elif self.total_cost == total_payments:
            return common.invoice_status.FULL_PAYMENT
        elif self.total_cost > total_payments:
            return common.invoice_status.PART_PAYMENT
        return common.invoice_status.OVER_PAYMENT

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
