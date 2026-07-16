import sdk.python.entities
from sdk.python.entities import Property
import datetime
from sdk.python.util.theme_status import VALID_AND_UPDATED, VALID_BUT_NOT_UPDATED


class Theme(sdk.python.entities.Entity):

    resource = "/themes/"
    json_name = "theme"

    id = Property(int)
    main_css_status = Property(int)
    main_css_error_message = Property(str)
    email_css_status = Property(int)
    email_css_error_message = Property(str)

    # not serialised by default, must be asked for via `embed` parameter
    main_css = Property(str)
    main_css_template_editing = Property(str)
    main_css_template_using = Property(str)
    email_css = Property(str)
    email_css_template_editing = Property(str)
    email_css_template_using = Property(str)
    last_updated = Property(datetime.datetime)

    def is_valid_and_updated(self):
        """Check both main and email CSS templates are valid and up to date."""
        return (
            self.main_css_status == VALID_AND_UPDATED
            and self.email_css_status == VALID_AND_UPDATED
        )

    def can_be_activated(self):
        """Check whether this theme can be a valid activated theme."""
        return (
            self.main_css_status >= VALID_BUT_NOT_UPDATED
            and self.email_css_status >= VALID_BUT_NOT_UPDATED
        )


class Themes(sdk.python.entities.Resource):
    """Resource for a list of themes."""

    entity_class = Theme
    json_name = "themes"


themes = Themes()
