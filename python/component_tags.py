import sdk.python.entities


class ComponentTag(sdk.python.entities.Entity):

    json_name = 'componentTag'
    primary_key = 'name'

    def __init__(self):
        super(ComponentTag, self).__init__()
        self.json_property(int, 'id')
        self.json_property(str, 'name')
