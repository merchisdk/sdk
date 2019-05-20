import urllib.parse
import datetime
import sdk.python.util.roles
import sdk.python.util.timezones
import sdk.python.util.address_util as address_util
import sdk.python.util.gravatar as gravatar
from sdk.python.util.time_util import get_tzinfo_from_timezone_name
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.user_companies import UserCompany
from sdk.python.email_addresses import EmailAddress
from sdk.python.addresses import Address
from sdk.python.phone_numbers import PhoneNumber
from sdk.python.notifications import Notification
from sdk.python.files import File
from sdk.python.products import Product
from sdk.python.stores import EnrolledStore
from sdk.python.themes import Theme
from sdk.python.store_invitations import StoreInvitation
from sdk.python.job_comments import JobComment
from sdk.python.drafts import Draft
from sdk.python.draft_comments import DraftComment
from sdk.python.production_comments import ProductionComment


class SystemRole(sdk.python.entities.Entity):

    resource = '/system_roles/'
    json_name = 'system_role'

    role = Property(int)

    def __repr__(self, **kwargs):
        return "<role {}>".format(self.role)


class User(sdk.python.entities.Entity):

    resource = '/users/'
    json_name = 'user'

    id = Property(int)
    name = Property(str)
    password = Property(str)
    reset_token = Property(str)
    created = Property(datetime.datetime)
    timezone = Property(str)
    email_addresses = Property(EmailAddress)
    # not embedded by default, must be requested
    incomplete_jobs_count = Property(int)
    unpaid_jobs_count = Property(int)
    ready_for_shipping_count = Property(int)
    production_quoting_count = Property(int)
    comments = Property(str)
    preferred_language = Property(str)
    enable_crash_reports = Property(bool)
    enable_client_emails = Property(bool)
    enable_invoice_reminders = Property(bool)
    is_super_user = Property(bool)
    system_roles = Property(SystemRole)
    user_companies = Property(UserCompany, backref="user")
    addresses = Property(Address)
    phone_numbers = Property(PhoneNumber)
    categories = Property('sdk.python.categories.Category')
    notifications = Property(Notification)
    enrolled_stores = Property(EnrolledStore, backref="user")
    # products that supplier can produce
    products = Property(Product, backref="suppliers")
    # products that are saved by user for future reference
    saved_products = Property(Product, backref="saved_by_users")
    profile_picture = Property(File)
    upload_files = Property(File, backref="uploader")
    themes = Property(Theme, backref="author")
    sent_store_invitations = Property(StoreInvitation, backref="sender")
    received_store_invitations = Property(StoreInvitation, backref="user")
    job_comments = Property(JobComment, backref="user")
    forwarded_job_comments = Property(JobComment, backref="forwards")
    drafts = Property(Draft, backref="designer")
    draft_comments = Property(DraftComment, backref="user")
    forwarded_draft_comments = Property(DraftComment, backref="forwards")
    production_comments = Property(ProductionComment, backref="user")
    forwarded_production_comments = Property(ProductionComment,
                                             backref="forwards")
    notifications = Property(Notification, backref="recipient")
    sent_notifications = Property(Notification, backref="sender")

    def role_in_store(self, store_id):
        """ The role of this user of specific store id """
        if self.enrolled_stores:
            for enrolled_store in self.enrolled_stores:
                if enrolled_store.store.id == store_id:
                    return enrolled_store.role
        return sdk.python.util.roles.PUBLIC

    def all_roles(self):
        """ Return all the roles that user have registered in super user
            have all possible roles
        """
        if self.is_super_user:
            return sdk.python.util.roles.ALL_ROLES
        roles_dict = set(ed.role for ed in self.enrolled_stores)
        roles_dict.add(sdk.python.util.roles.PUBLIC)
        return roles_dict

    def has_roles(self, roles, combination_method=any):
        """ Assert whether user have roles registered """
        user_all_roles = self.all_roles()
        return combination_method(role in user_all_roles for role in roles)

    def has_authority(self, store_id, roles):
        """ Check whether user is in one of the roles in certain store """
        return self.is_super_user or self.role_in_store(store_id) in roles

    def is_not_client(self, store_id):
        """ Check to see if the user is part of the store staff. """
        return self.has_authority(store_id,
                                  sdk.python.util.roles.BUSINESS_ACCOUNTS)

    def can_view_info_section(self, job):
        """ Return whether current user should need to view info
            section of a job.
        """
        return self.has_authority(job.store.id,
                                  sdk.python.util.roles.BUSINESS_ACCOUNTS)

    def can_view_payment_section(self, job):
        """ Return whether current user should need to view payment
            section of a job.
        """
        return self.has_authority(job.store.id,
                                  sdk.python.util.roles.INVOICE_ROLES)

    def can_view_production_section(self, job):
        """ Return whether current user should need to view production
            section of a job.
        """
        return self.has_authority(job.store.id,
                                  sdk.python.util.roles.PRODUCTION_SECTION)

    def can_view_drafting_section(self, job):
        """ Return whether current user should need to view drafting
            section of a job.
        """
        return self.has_authority(job.store.id,
                                  sdk.python.util.roles.DESIGN_SECTION)

    def can_view_shipping_section(self, job):
        """ Return whether current user should need to view shipping
            section of a job.
        """
        return self.has_authority(job.store.id,
                                  sdk.python.util.roles.SHIPPING_SECTION)

    def user_type(self):
        """ Return a user friendly string indicating what type the user is """
        if self.is_super_user:
            return "System Admin"
        return "Normal User"

    def has_system_role(self, role):
        """ Return whether current user has a system role """
        return self.system_roles is not None and \
            any(system_role.role == role for system_role in self.system_roles)

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
