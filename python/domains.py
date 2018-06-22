import sdk.python.entities
from sdk.python.companies import Company
from sdk.python.files import File
from sdk.python.themes import Theme
from sdk.python.menus import Menu
from sdk.python.domain_invitations import DomainInvitation
import sdk.python.util.menu_util as menu_util
from sdk.python.util.google import reconstitute_conversion_script
from sdk.python.util.google import extract_script_parameters
from sdk.python.util.brand_util import PLATFORM_MASCOT_ICON


class Domain(sdk.python.entities.Entity):
    """ merchi python SDK object representing Domains.

        A domain originally represented only a domain in the DNS sense, being
        an entity that is allowed to use the merchi API on a website, etc.

        In newer versions, much of the system is segregated by domain.
        Products, Jobs, Categories and Managers belong to a domain, and the
        settings of the domain will impact the behaviour and options of the
        other entities that fall under it.

        Domains defer to their Company for some of their settings.

        All user login Sessions maintain an awareness of from which domain
        the user logged in. It is illegal to create a Session except via
        a website with an attached Domain that is acting as a proxy. The domain
        will authenticate itself as well as the user when asking to create
        the session.

        Methods for making requests to get information or update the domains
        settings are inherited from sdk.python.entities.Entity.
    """

    resource = '/domains/'
    json_name = 'domain'

    def __init__(self):
        from sdk.python.products import Product
        from sdk.python.categories import Category
        super(Domain, self).__init__()

        self.json_property(int, 'id')
        self.json_property(int, 'active_theme_id')
        self.json_property(str, 'domain')
        self.json_property(str, 'sub_domain')
        self.json_property(str, 'email_domain')
        self.json_property(str, 'theme')
        self.json_property(str, 'sms_name')
        self.json_property(str, 'api_secret')
        self.json_property(str, 'conversion_tracking_code')
        self.json_property(bool, 'show_domain_publicly')
        self.json_property(bool, 'enable_notifications')
        self.json_property(bool, 'enable_email_notifications')
        self.json_property(bool, 'enable_sms_notifications')

        # not serialised by default, must be embedded specifically
        self.json_property(str, 'header_html')
        self.json_property(str, 'header_js')
        self.json_property(str, 'footer_html')
        self.json_property(str, 'footer_js')
        self.json_property(str, 'index_html')
        self.json_property(str, 'index_js')
        self.json_property(str, 'invoices_html')
        self.json_property(str, 'invoices_js')
        self.json_property(str, 'domain_invite_html')
        self.json_property(str, 'domain_invite_js')
        self.json_property(str, 'password_reset_html')
        self.json_property(str, 'password_reset_js')
        self.json_property(str, 'password_change_html')
        self.json_property(str, 'password_change_js')
        self.json_property(str, 'sms_login_html')
        self.json_property(str, 'sms_login_js')
        self.json_property(str, 'sms_token_html')
        self.json_property(str, 'sms_token_js')
        self.json_property(str, 'jobs_html')
        self.json_property(str, 'jobs_js')
        self.json_property(str, 'job_drafting_html')
        self.json_property(str, 'job_drafting_js')
        self.json_property(str, 'draft_preview_html')
        self.json_property(str, 'draft_preview_js')
        self.json_property(str, 'invoice_html')
        self.json_property(str, 'invoice_js')
        self.json_property(str, 'user_profile_html')
        self.json_property(str, 'user_profile_js')
        self.json_property(str, 'company_profile_html')
        self.json_property(str, 'company_profile_js')
        self.json_property(str, 'product_html')
        self.json_property(str, 'product_js')
        self.json_property(str, 'products_html')
        self.json_property(str, 'products_js')
        self.json_property(str, 'invoice_paid_html')
        self.json_property(str, 'invoice_paid_js')

        self.recursive_json_property(Theme, 'active_theme')
        self.recursive_json_property(DomainInvitation, 'domain_invitations')
        self.recursive_json_property(Company, "company")
        self.recursive_json_property(File, "logo")
        self.recursive_json_property(Product, "products")
        self.recursive_json_property(Category, 'categories')
        self.recursive_json_property(Theme, 'themes')
        self.recursive_json_property(Menu, 'menus')

    def public_categories(self):
        """ Return domain categories which are public """
        return [category for category in self.categories if
                category.show_public]

    def email_notifications_enabled(self):
        """ Return True if the domain has email notifications switched on """
        return self.enable_notifications and\
            self.enable_email_notifications

    def sms_notifications_enabled(self):
        """ Return True if the domain has SMS notifications switched on """
        return self.enable_notifications and\
            self.enable_sms_notifications

    def main_menu(self):
        """ Return the first menu of menu type MAIN else return None """
        if self.menus:
            for menu in self.menus:
                if menu.menu_type == menu_util.MAIN:
                    return menu
        return None

    def safe_conversion_tracking_code(self, invoice=None):
        """ Return javascript conversion code string safe to serve to clients.

            Javascript is 'santised' to remove any unknown parts by simply
            extracting known parameters from the format that a correct
            conversion tracking code is expected to be in, and then
            rerendering it in that format. In the process, any extra code
            gets thrown away.

            If invoice is supplied, it may be used to fill in any missing
            non domain constant details like currency and value.
        """
        code = self.conversion_tracking_code
        if code is None or code == '':
            return ''
        script_parameters = extract_script_parameters(code)
        return reconstitute_conversion_script(script_parameters, invoice)

    def logo_url(self):
        """ Return the domain logo if there is one or else return the
            PLATFORM_MASCOT_ICON
        """
        if self.logo:
            return self.logo.view_url
        return PLATFORM_MASCOT_ICON


class EnrolledDomain(sdk.python.entities.Entity):

    resource = '/enrolled_domains/'
    json_name = 'enrolled_domain'

    def __init__(self):
        from sdk.python.users import User

        super(EnrolledDomain, self).__init__()
        self.json_property(int, 'id')
        self.json_property(str, 'role')
        self.recursive_json_property(Domain, "domain")
        self.recursive_json_property(User, "user")


class Domains(sdk.python.entities.Resource):

    entity_class = Domain
    json_name = 'domains'

    def get_by_name(self, name, api_secret):
        result, _ = self.fetch(query={'name': name},
                               api_secret=api_secret)
        if len(result) == 1:
            return result[0]
        return None


class EnrolledDomains(sdk.python.entities.Resource):

    entity_class = EnrolledDomain
    json_name = 'enrolled_domains'


domains = Domains()
enrolled_domains = EnrolledDomains()
