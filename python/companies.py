import sdk.python.util.address_util as address_util
import sdk.python.entities
from sdk.python.country_taxes import CountryTax
from sdk.python.email_addresses import EmailAddress
from sdk.python.addresses import Address
from sdk.python.files import File
from sdk.python.phone_numbers import PhoneNumber
from sdk.python.banks import Bank
from sdk.python.subscription_plans import SubscriptionPlan
import sdk.python.users
import sdk.python.country_taxes
from sdk.python.entities import Property


class Company(sdk.python.entities.Entity):

    resource = '/companies/'
    json_name = 'company'

    id = Property(int)
    name = Property(str)
    website = Property(str)
    country = Property(str)
    tax_number = Property(str)
    tax_number_type = Property(int)
    default_tax_type = Property(CountryTax)
    default_currency = Property(str)
    paypal_account = Property(str)
    paypal_password = Property(str)
    paypal_signature = Property(str)
    is_paypal_valid = Property(bool)
    stripe_customer_id = Property(str)
    is_new = Property(bool)
    subscription_outstanding = Property(bool)
    stripe_publishable_key = Property(str)
    stripe_api_key = Property(str)
    accept_utrust = Property(bool)
    utrust_api_key = Property(str)
    utrust_webhook_key = Property(str)
    is_utrust_valid = Property(bool)
    call_to_actions = Property(str)
    is_stripe_valid = Property(bool)
    accept_stripe = Property(bool)
    accept_paypal = Property(bool)
    accept_bank_transfer = Property(bool)
    accept_phone_payment = Property(bool)
    temporary_created = Property(bool)
    logo = Property(File)
    email_addresses = Property(EmailAddress)
    addresses = Property(Address)
    phone_numbers = Property(PhoneNumber)
    payment_phone_numbers = Property(PhoneNumber)
    user_companies = Property(sdk.python.user_companies.UserCompany,
                              backref="company")
    # products that are saved by company for future reference
    saved_products = Property(sdk.python.products.Product,
                              backref="saved_by_companies")
    banks = Property(Bank)
    default_tax_type = Property(sdk.python.country_taxes.CountryTax)
    subscription_plan = Property(SubscriptionPlan,
                                 backref="companies")

    @property
    def default_banks(self):
        """ Return a list of banks attached to this company that are to be
            shown as invoice payment options by default.
        """
        return [bank for bank in self.banks if bank.default]

    def primary_address(self):
        """ Return the company primary address """
        if self.addresses:
            return self.addresses[0]
        return None

    def dictionary_of_address_names_and_ids(self):
        """ Return an array of dictionaries which contain the
            name and id of the address which are related to this company.
        """
        saved_addresses = []
        if self.addresses:
            for i, address in enumerate(self.addresses):
                name = address_util.name_primary(i, self.name)
                saved_addresses.append({'name': name,
                                        'id': address.id})
        return saved_addresses

    def is_payment_phone_numbers_valid(self):
        """ If the company has one or more payment phone numbers this method
            will return True
        """
        return len(self.payment_phone_numbers) > 0

    def is_banks_valid(self):
        """ If the company has one or more bank accounts this method will
            return True
        """
        return len(self.banks) > 0

    def primary_phone_number(self):
        """ Return the company's primary phone number with area code. """
        try:
            primary_phone_number = \
                self.phone_numbers[0].international_format_number
        except (TypeError, IndexError):
            primary_phone_number = ""

        return primary_phone_number

    def primary_email_address(self):
        """ Return the company's primary email address, or the empty string """
        try:
            primary_email_address = self.email_addresses[0].email_address
        except (TypeError, IndexError):
            primary_email_address = ""

        return primary_email_address


class Companies(sdk.python.entities.Resource):

    entity_class = Company
    json_name = 'companies'


companies = Companies()
