import urllib.parse
import datetime
import sdk.python.util.roles
import sdk.python.util.timezones
import sdk.python.util.address_util as address_util
import sdk.python.util.gravatar as gravatar
from sdk.python.util.time_util import get_tzinfo_from_timezone_name
import sdk.python.entities
from sdk.python.user_companies import UserCompany
from sdk.python.email_addresses import EmailAddress
from sdk.python.addresses import Address
from sdk.python.phone_numbers import PhoneNumber
from sdk.python.categories import Category
from sdk.python.notifications import Notification
from sdk.python.files import File
from sdk.python.products import Product
from sdk.python.domains import EnrolledDomain


class User(sdk.python.entities.Entity):

    resource = '/users/'
    json_name = 'user'

    def __init__(self):
        super(User, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(str, 'password')
        self.json_property(str, 'reset_token')
        self.json_property(datetime.datetime, 'created')
        self.json_property(str, 'timezone')
        self.recursive_json_property(EmailAddress, 'email_addresses')
        # not embedded by default, must be requested
        self.json_property(int, 'incomplete_jobs_count')
        self.json_property(int, 'unpaid_jobs_count')
        self.json_property(int, 'ready_for_shipping_count')
        self.json_property(int, 'production_quoting_count')
        self.json_property(str, 'comments')
        self.json_property(str, 'preferred_language')
        self.json_property(bool, 'enable_crash_reports')
        self.json_property(bool, 'enable_client_emails')
        self.json_property(bool, 'enable_invoice_reminders')
        self.json_property(bool, 'is_super_user')
        self.recursive_json_property(UserCompany, 'user_companies')
        self.recursive_json_property(Address, 'addresses')
        self.recursive_json_property(PhoneNumber, 'phone_numbers')
        self.recursive_json_property(Category, 'categories')
        self.recursive_json_property(Notification, 'notifications')
        self.recursive_json_property(EnrolledDomain, 'enrolled_domains')
        # products that supplier can produce
        self.recursive_json_property(Product, 'products')
        self.recursive_json_property(File, 'profile_picture')

    def role_in_domain(self, domain_id):
        """ The role of this user of specific domain id """
        if self.enrolled_domains:
            for enrolled_domain in self.enrolled_domains:
                if enrolled_domain.domain.id == domain_id:
                    return enrolled_domain.role
        return sdk.python.util.roles.PUBLIC

    def all_roles(self):
        """ Return all the roles that user have registered in super user
            have all possible roles
        """
        if self.is_super_user:
            return sdk.python.util.roles.ALL_ROLES
        roles_dict = set(ed.role for ed in self.enrolled_domains)
        roles_dict.add(sdk.python.util.roles.PUBLIC)
        return roles_dict

    def has_roles(self, roles, combination_method=any):
        """ Assert whether user have roles registered """
        user_all_roles = self.all_roles()
        return combination_method(role in user_all_roles for role in roles)

    def has_authority(self, domain_id, roles):
        """ Check whether user is in one of the roles in certain domain """
        return self.is_super_user or self.role_in_domain(domain_id) in roles

    def is_not_client(self, domain_id):
        """ Check to see if the user is part of the domain staff. """
        return self.has_authority(domain_id,
                                  sdk.python.util.roles.BUSINESS_ACCOUNTS)

    def can_view_info_section(self, job):
        """ Return whether current user should need to view info
            section of a job.
        """
        return self.has_authority(job.domain.id,
                                  sdk.python.util.roles.BUSINESS_ACCOUNTS)

    def can_view_payment_section(self, job):
        """ Return whether current user should need to view payment
            section of a job.
        """
        return self.has_authority(job.domain.id,
                                  sdk.python.util.roles.INVOICE_ROLES)

    def can_view_production_section(self, job):
        """ Return whether current user should need to view production
            section of a job.
        """
        return self.has_authority(job.domain.id,
                                  sdk.python.util.roles.PRODUCTION_SECTION)

    def can_view_drafting_section(self, job):
        """ Return whether current user should need to view drafting
            section of a job.
        """
        return self.has_authority(job.domain.id,
                                  sdk.python.util.roles.DESIGN_SECTION)

    def can_view_shipping_section(self, job):
        """ Return whether current user should need to view shipping
            section of a job.
        """
        return self.has_authority(job.domain.id,
                                  sdk.python.util.roles.SHIPPING_SECTION)

    def user_type(self):
        """ Return a user friendly string indicating what type the user is """
        if self.is_super_user:
            return "System Admin"
        return "Normal User"

    def is_component_builder(self):
        """ Return where current user is component builder """
        return self.system_roles is not None and \
            sdk.python.util.roles.SYSTEM_COMPONENT_BUILDER in self.system_roles

    def primary_company_name(self):
        """ Return the user's primary company name if the user has a company """
        if self.user_companies and self.user_companies[0].company:
            return self.user_companies[0].company.name
        return ""

    def company_country(self):
        """ Return the country which the users is located """
        try:
            country = self.addresses[0].country_name()
        except (TypeError, IndexError):
            country = "Unknown"

        return country

    def primary_phone_number(self):
        """ Return the users primary phone number including the area code """
        try:
            primary_phone_number = \
                self.phone_numbers[0].international_format_number
        except (TypeError, IndexError):
            primary_phone_number = ""

        return primary_phone_number

    def primary_email_address(self):
        """ Return the user's primary email address if they have one """
        try:
            primary_email_address = self.email_addresses[0].email_address
        except (TypeError, IndexError):
            primary_email_address = ""

        return primary_email_address

    def get_tzinfo(self):
        """ Return the timezone of the user as a dateutil.tz object. """
        if self.timezone is not None:
            timezone = self.timezone
        else:
            timezone = sdk.python.util.timezones.DEFAULT_TIMEZONE
        return get_tzinfo_from_timezone_name(timezone)

    @classmethod
    def empty_user(cls):
        empty_user = User()
        empty_user.id = -1
        empty_user.timezone = sdk.python.util.timezones.DEFAULT_TIMEZONE
        return empty_user

    def profile_picture_url(self, size):
        default_img_size = 50
        if size is None:
            size = default_img_size
        if self.profile_picture:
            return self.profile_picture.view_url
        try:
            primary_email = self.email_addresses[0].email_address
        except (IndexError, TypeError):
            primary_email = ''
        return gravatar.gravatar_url(primary_email, size)

    def dictionary_of_addresses_and_ids(self, address_name=None,
                                        company_addresses=True):
        """ Return an array of dictionaries which contain the
            name and id of address which are related to this user. If the
            company_address attribute is True it will also return the users
            related company addresses as well.
        """
        saved_addresses = []
        if self.addresses:
            for i, address in enumerate(self.addresses):
                if address_name:
                    name = address_util.name_primary(i, address_name)
                else:
                    name = address_util.name_primary(i, self.name)
                saved_addresses.append({'name': name,
                                        'id': address.id})

        if company_addresses and self.user_companies:
            for user_company in self.user_companies:
                company = user_company.company
                saved_addresses += company.dictionary_of_address_names_and_ids()
        return saved_addresses

    def public_nav_extension(self, url):
        """ Extend menu items with user info so that if
            the user is redirected to a third party site
        """
        query = "?"
        if query in url:
            query = "&"
        return "{0}{1}user_id={2}&user_name={3}&user_email={4}". \
            format(url, query, self.id, urllib.parse.quote(self.name, safe=''),
                   self.primary_email_address())


class Users(sdk.python.entities.Resource):

    entity_class = User
    json_name = 'users'


users = Users()
