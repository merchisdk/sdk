import datetime
import sdk.python.entities
from sdk.python.entities import Property


class ComponentVersion(sdk.python.entities.Entity):

    json_name = 'componentVersion'

    id = Property(int)
    name = Property(str)
    created_at = Property(datetime.datetime)
    body = Property(str)
    component = Property(sdk.python.components.Component)
