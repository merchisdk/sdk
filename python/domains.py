import sdk.python.entities
from sdk.python.companies import Company
from sdk.python.files import File
from sdk.python.themes import Theme
from sdk.python.menus import Menu
from sdk.python.domain_invitations import DomainInvitation
import sdk.python.util.menu_util as menu_util
from sdk.python.util.public_page_embeds import DOMAIN_PRODUCTS_DOMAIN_EMBED,\
    DOMAIN_INDEX_DOMAIN_EMBED, CLIENT_INVOICES_DOMAIN_EMBED
from sdk.python.util.google import reconstitute_conversion_script
from sdk.python.util.google import extract_script_parameters
from sdk.python.util.brand_util import PLATFORM_MASCOT_ICON
from sdk.python.util.templates import compile_template


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

    def get_index_page_content(self, database):
        """ Return HTML content for the public domain index page.

            That will be the one from the theme, if there is one, otherwise
            it will be the default. The caller is responsible for ensuring
            that the active theme, and also its template is properly embedded.
        """
        if self.active_theme:
            return self.active_theme.index_page_compiled
        with open("sdk/python/util/templates/index.html") as template_file:
            return compile_template(template_file.read(), database,
                                    domain_embed=DOMAIN_INDEX_DOMAIN_EMBED)

    def get_invoices_page_content(self, database):
        """ Return HTML content for the public domain invoices page.

            That will be the one from the theme, if there is one, otherwise
            it will be the default. The caller is responsible for ensuring
            that the active theme, and also its template is properly embedded.
        """
        if self.active_theme:
            return self.active_theme.invoices_page_compiled
        with open("sdk/python/util/templates/invoices.html") as template_file:
            return compile_template(template_file.read(), database,
                                    domain_embed=CLIENT_INVOICES_DOMAIN_EMBED)

    def get_products_page_content(self, database):
        """ Return HTML content for the public domain products page.

            That will be the one from the theme, if there is one, otherwise
            it will be the default. The caller is responsible for ensuring
            that the active theme, and also its template is properly embedded.
        """
        if self.active_theme:
            return self.active_theme.products_page_compiled
        with open("sdk/python/util/templates/products.html") as template_file:
            return compile_template(template_file.read(), database,
                                    domain_embed=DOMAIN_PRODUCTS_DOMAIN_EMBED)

    def get_domain_invite_page_content(self, database):
        """ Return HTML content for the public domain invite page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.domain_invite_page_compiled

    def get_reset_password_page_content(self, database):
        """ Return HTML content for the public password reset page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.reset_password_page_compiled

    def get_password_change_page_content(self, database):
        """ Return HTML content for the public password change page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.password_change_page_compiled

    def get_sms_login_page_content(self, database):
        """ Return HTML content for the public sms login page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.sms_login_page_compiled

    def get_sms_token_page_content(self, database):
        """ Return HTML content for the public sms token page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.sms_token_page_compiled

    def get_jobs_page_content(self, database):
        """ Return HTML content for the public jobs page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.jobs_page_compiled

    def get_job_drafting_page_content(self, database):
        """ Return HTML content for the public job drafting page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.job_drafting_page_compiled

    def get_draft_preview_page_content(self, database):
        """ Return HTML content for the public drafting preview page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.draft_preview_page_compiled

    def get_invoice_page_content(self, database):
        """ Return HTML content for the public invoice page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.invoice_page_compiled

    def get_user_profile_page_content(self, database):
        """ Return HTML content for the public user profile page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.user_profile_page_compiled

    def get_company_profile_page_content(self, database):
        """ Return HTML content for the company profile invite page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.company_profile_page_compiled

    def get_product_page_content(self, database):
        """ Return HTML content for the public product page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.product_page_compiled

    def get_invoice_paid_page_content(self, database):
        """ Return HTML content for the public invoice paid page, if
            a template has been created and activated.
        """
        if self.active_theme:
            return self.active_theme.invoice_paid_page_compiled

    def get_header_content(self, database):
        """ Return HTML content for the headers of public domain pages.

            That will be the one from the theme, if there is one, otherwise
            it will be the default. The caller is responsible for ensuring
            that the active theme, and also its template is properly embedded.
        """
        if self.active_theme:
            return self.active_theme.header_compiled
        with open("sdk/python/util/templates/header.html") as template_file:
            return compile_template(template_file.read(), database)

    def get_footer_content(self, database):
        """ Return HTML content for the footers of public domain pages.

            That will be the one from the theme, if there is one, otherwise
            it will be the default. The caller is responsible for ensuring
            that the active theme, and also its template is properly embedded.
        """
        if self.active_theme:
            return self.active_theme.footer_compiled
        with open("sdk/python/util/templates/footer.html") as template_file:
            return compile_template(template_file.read(), database)

    def get_template_scripts(self, database, user_embed=None, job_embed=None,
                             domain_embed=None):
        """ Return a div with the template script rendered inside of it. """
        template = ''
        if self.active_theme:
            template = self.active_theme.scripts_template()
        return compile_template(template, database, user_embed=user_embed,
                                job_embed=job_embed, domain_embed=domain_embed,
                                with_script=True)

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
