import sdk.python.entities
from sdk.python.files import File
from sdk.python.themes import Theme
from sdk.python.menus import Menu
from sdk.python.domain_invitations import DomainInvitation
import sdk.python.util.menu_util as menu_util
from sdk.python.util.google import reconstitute_conversion_script
from sdk.python.util.google import extract_script_parameters
from sdk.python.util.google import reconstitute_global_script
from sdk.python.util.google import extract_new_global_script_parameters
from sdk.python.util.google import reconstitute_new_conversion_script
from sdk.python.util.google import extract_new_conversion_script_parameters
from sdk.python.util.brand_util import PLATFORM_MASCOT_ICON
from sdk.python.entities import Property


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

    id = Property(int)
    active_theme_id = Property(int)
    domain = Property(str)
    sub_domain = Property(str)
    email_domain = Property(str)
    theme = Property(str)
    sms_name = Property(str)
    api_secret = Property(str)
    conversion_tracking_code = Property(str)
    new_conversion_tracking_code = Property(str)
    new_global_tracking_code = Property(str)
    show_domain_publicly = Property(bool)
    enable_notifications = Property(bool)
    enable_email_notifications = Property(bool)
    enable_sms_notifications = Property(bool)
    active_theme = Property(Theme, backref="domain")
    domain_invitations = Property(DomainInvitation, backref='domain')
    company = Property("sdk.python.companies.Company")
    logo = Property(File)
    themes = Property(Theme)
    menus = Property(Menu)

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

    def safe_new_conversion_tracking_code(self, invoice=None):
        """ Return javascript conversion code string safe to serve to clients.

            Javascript is 'santised' to remove any unknown parts by simply
            extracting known parameters from the format that a correct
            conversion tracking code is expected to be in, and then
            rerendering it in that format. In the process, any extra code
            gets thrown away.

            If invoice is supplied, it may be used to fill in any missing
            non domain constant details like currency and value.
        """
        code = self.new_conversion_tracking_code
        if code is None or code == '':
            return ''
        script_parameters = extract_new_conversion_script_parameters(code)
        return reconstitute_new_conversion_script(script_parameters, invoice)

    def safe_new_global_tracking_code(self, invoice=None):
        """ Return javascript tracking code string safe to serve to clients.

            Javascript is 'santised' to remove any unknown parts by simply
            extracting known parameters from the format that a correct
            conversion tracking code is expected to be in, and then
            rerendering it in that format. In the process, any extra code
            gets thrown away.

            If invoice is supplied, it may be used to fill in any missing
            non domain constant details like currency and value.
        """
        code = self.new_global_tracking_code
        if code is None or code == '':
            return ''
        script_parameters = extract_new_global_script_parameters(code)
        return reconstitute_global_script(script_parameters, invoice)

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

    id = Property(int)
    role = Property(str)
    domain = Property(Domain)


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
