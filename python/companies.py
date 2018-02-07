import sdk.python.util.address_util as address_util
import sdk.python.entities
from sdk.python.email_addresses import EmailAddress
from sdk.python.addresses import Address
from sdk.python.files import File
from sdk.python.phone_numbers import PhoneNumber
from sdk.python.banks import Bank
import sdk.python.users
import sdk.python.country_taxes


class Company(sdk.python.entities.Entity):

    resource = '/companies/'
    json_name = 'company'

    def __init__(self):
        from sdk.python.company_invitations import CompanyInvitation
        super(Company, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(str, 'website')
        self.json_property(str, 'tax_number')
        self.json_property(int, 'tax_number_type')
        self.json_property(str, 'default_currency')
        self.json_property(str, 'paypal_account')
        self.json_property(str, 'paypal_password')
        self.json_property(str, 'paypal_signature')
        self.json_property(bool, 'is_paypal_valid')
        self.json_property(str, 'stripe_publishable_key')
        self.json_property(str, 'stripe_api_key')
        self.json_property(bool, 'is_stripe_valid')
        self.json_property(bool, 'accept_stripe')
        self.json_property(bool, 'accept_paypal')
        self.json_property(bool, 'accept_bank_transfer')
        self.json_property(bool, 'accept_phone_payment')
        self.json_property(bool, 'temporary_created')
        self.recursive_json_property(File, 'logo')
        self.recursive_json_property(EmailAddress, 'email_addresses')
        self.recursive_json_property(Address, 'addresses')
        self.recursive_json_property(PhoneNumber, 'phone_numbers')
        self.recursive_json_property(PhoneNumber, 'payment_phone_numbers')
        self.recursive_json_property(sdk.python.user_companies.UserCompany,
                                     'user_companies')
        self.recursive_json_property(Bank, 'banks')
        self.recursive_json_property(CompanyInvitation, 'company_invitations')
        self.recursive_json_property(sdk.python.country_taxes.CountryTax,
                                     'default_tax_type')

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
