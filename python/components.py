import sdk.python.entities
from sdk.python.component_tags import ComponentTag


class Component(sdk.python.entities.Entity):

    resource = '/components/'
    json_name = 'component'

    def __init__(self):
        super(Component, self).__init__()
        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(str, 'body')
        self.json_property(str, 'description')
        self.recursive_json_property(ComponentTag, 'tags')


class Components(sdk.python.entities.Resource):

    entity_class = Component
    json_name = "components"


components = Components()
