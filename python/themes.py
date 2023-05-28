import sdk.python.entities
from sdk.python.entities import Property
import datetime
from sdk.python.files import File
from sdk.python.menus import Menu
from sdk.python.pages import Page
from sdk.python.util.theme_status import VALID_AND_UPDATED, \
    VALID_BUT_NOT_UPDATED


class Theme(sdk.python.entities.Entity):

    resource = '/themes/'
    json_name = 'theme'

    id = Property(int)
    components = Property("sdk.python.components.Component")
    js_bundle = Property(str)
    name = Property(str)
    description = Property(str)
    foundation = Property(int)
    public = Property(bool)
    main_css_status = Property(int)
    main_css_error_message = Property(str)
    email_css_status = Property(int)
    email_css_error_message = Property(str)

    # not serialised by default, mut be asked for via `embed` parameter
    main_css = Property(str)
    main_css_template_editing = Property(str)
    main_css_template_using = Property(str)
    email_css = Property(str)
    email_css_template_editing = Property(str)
    email_css_template_using = Property(str)
    header_template = Property(str)
    header_html = Property(str)
    footer_template = Property(str)
    footer_html = Property(str)
    index_page_template = Property(str)
    index_html = Property(str)
    products_page_template = Property(str)
    products_html = Property(str)
    domain_invite_page_template = Property(str)
    domain_invite_html = Property(str)
    reset_password_page_template = Property(str)
    password_reset_html = Property(str)
    password_change_page_template = Property(str)
    password_change_html = Property(str)
    job_drafting_page_template = Property(str)
    job_drafting_html = Property(str)
    job_quote_requested_page_template = Property(str)
    job_quote_requested_html = Property(str)
    invoice_page_template = Property(str)
    invoice_html = Property(str)
    user_profile_page_template = Property(str)
    user_profile_html = Property(str)
    product_page_template = Property(str)
    product_html = Property(str)
    invoice_paid_page_template = Property(str)
    invoice_paid_html = Property(str)
    login_page_template = Property(str)
    login_page_html = Property(str)
    error_page_template = Property(str)
    error_page_html = Property(str)

    index_page_error = Property(str)
    products_page_error = Property(str)
    domain_invite_page_error = Property(str)
    reset_password_page_error = Property(str)
    password_change_page_error = Property(str)
    job_drafting_page_error = Property(str)
    job_quote_requested_page_error = Property(str)
    invoice_page_error = Property(str)
    product_page_error = Property(str)
    invoice_paid_page_error = Property(str)
    login_page_error = Property(str)
    error_page_error = Property(str)
    header_error = Property(str)
    footer_error = Property(str)
    last_updated = Property(datetime.datetime)
    feature_image = Property(File)
    images = Property(File)
    css_image_files = Property(File)
    menus = Property(Menu)
    pages = Property(Page)
    default_for_domain_type = Property(int)

    def is_valid_and_updated(self):
        """ Check both main css template and email css template
            are valid and up to date
        """
        return self.main_css_status == VALID_AND_UPDATED and \
            self.email_css_status == VALID_AND_UPDATED and \
            self.index_page_error is None and\
            self.login_page_error is None and\
            self.error_page_error is None and\
            self.products_page_error is None and\
            self.domain_invite_page_error is None and\
            self.reset_password_page_error is None and\
            self.password_change_page_error is None and\
            self.job_drafting_page_error is None and\
            self.invoice_page_error is None and\
            self.product_page_error is None and\
            self.invoice_paid_page_error is None

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

    name = Property(str)


class DefaultThemes(sdk.python.entities.Resource):
    """ Resource for a list of default themes """

    entity_class = DefaultTheme
    json_name = 'defaultThemes'


default_themes = DefaultThemes()
themes = Themes()
