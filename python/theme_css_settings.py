import datetime
import sdk.python.entities
import sdk.python.users
from sdk.python.entities import Property


class ThemeCssSetting(sdk.python.entities.Entity):

    resource = '/theme_css_settings/'
    json_name = 'themeCssSetting'

    id = Property(int)
    created = Property(datetime.datetime)
    created_by = Property('sdk.python.users.User')
    allowed_attributes = Property(str)
    not_allowed_attributes = Property(str)


class ThemeCssSettings(sdk.python.entities.Resource):

    entity_class = ThemeCssSetting
    json_name = 'themeCssSettings'


theme_css_settings = ThemeCssSettings()
