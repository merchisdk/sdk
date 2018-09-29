import sdk.python.entities
from sdk.python.entities import Property


class ComponentTag(sdk.python.entities.Entity):

    json_name = 'componentTag'
    primary_key = 'name'

    id = Property(int)
    name = Property(str)
