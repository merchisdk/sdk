import sdk.python.entities
from sdk.python.component_tags import ComponentTag
from sdk.python.entities import Property
from sdk.python.files import File


class Component(sdk.python.entities.Entity):

    resource = '/components/'
    json_name = 'component'

    id = Property(int)
    name = Property(str)
    body = Property(str)
    description = Property(str)
    tags = Property(ComponentTag)
    images = Property(File)
    feature_image = Property(File)


class Components(sdk.python.entities.Resource):

    entity_class = Component
    json_name = "components"


components = Components()
