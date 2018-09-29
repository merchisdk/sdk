import sdk.python.entities
from sdk.python.component_tags import ComponentTag
from sdk.python.entities import Property


class Component(sdk.python.entities.Entity):

    resource = '/components/'
    json_name = 'component'

    id = Property(int)
    name = Property(str)
    body = Property(str)
    description = Property(str)
    tags = Property(ComponentTag)


class Components(sdk.python.entities.Resource):

    entity_class = Component
    json_name = "components"


components = Components()
