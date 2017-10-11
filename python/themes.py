import sdk.python.entities
import datetime
from sdk.python.files import File
from common.theme_status import VALID_AND_UPDATED, VALID_BUT_NOT_UPDATED


class Theme(sdk.python.entities.Entity):

    resource = '/themes/'
    json_name = 'theme'

    def __init__(self):
        super(Theme, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(str, 'description')
        self.json_property(bool, 'public')
        self.json_property(int, "main_css_status")
        self.json_property(str, "main_css_error_message")
        self.json_property(int, "email_css_status")
        self.json_property(str, "email_css_error_message")

        # not serialised by default, mut be asked for via `embed` parameter
        self.json_property(str, "index_page_template")
        self.json_property(str, "index_page_compiled")
        self.json_property(str, "invoices_page_template")
        self.json_property(str, "invoices_page_compiled")
        self.json_property(str, "products_page_template")
        self.json_property(str, "products_page_compiled")
        self.json_property(str, "header_template")
        self.json_property(str, "header_compiled")
        self.json_property(str, "footer_template")
        self.json_property(str, "footer_compiled")

        self.json_property(str, "index_page_error")
        self.json_property(str, "invoices_page_error")
        self.json_property(str, "products_page_error")
        self.json_property(str, "header_error")
        self.json_property(str, "footer_error")
        self.json_property(datetime.datetime, 'last_updated')
        self.recursive_json_property(File, "main_css_file")
        self.recursive_json_property(File, "main_css_template_editing")
        self.recursive_json_property(File, "main_css_template_using")
        self.recursive_json_property(File, "email_css_file")
        self.recursive_json_property(File, "email_css_template_editing")
        self.recursive_json_property(File, "email_css_template_using")
        self.recursive_json_property(File, "feature_image")
        self.recursive_json_property(File, 'css_image_files')
        from sdk.python.users import User
        self.recursive_json_property(User, "author")
        from sdk.python.domains import Domain
        self.recursive_json_property(Domain, "domain")

    def is_valid_and_updated(self):
        """ Check both main css template and email css template
            are valid and up to date
        """
        return self.main_css_status == VALID_AND_UPDATED and \
            self.email_css_status == VALID_AND_UPDATED and \
            self.index_page_error is None and\
            self.invoices_page_error is None and\
            self.products_page_error is None

    def can_be_activated(self):
        """ Check whether this theme can be a valid activated theme """
        return self.main_css_status >= VALID_BUT_NOT_UPDATED and \
            self.email_css_status >= VALID_BUT_NOT_UPDATED


class Themes(sdk.python.entities.Resource):
    """ Resource for a list of themes """

    entity_class = Theme
    json_name = 'themes'


class DefaultTheme(sdk.python.entities.Entity):
    """ Resource for the default theme. """

    resource = '/default_themes/'
    json_name = 'defaultTheme'

    def __init__(self):
        super(DefaultTheme, self).__init__()
        self.json_property(str, 'name')


class DefaultThemes(sdk.python.entities.Resource):
    """ Resource for a list of default themes """

    entity_class = DefaultTheme
    json_name = 'defaultThemes'


default_themes = DefaultThemes()
themes = Themes()
