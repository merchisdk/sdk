import sdk.python.entities
from sdk.python.entities import Property


class Page(sdk.python.entities.Entity):

    resource = '/pages/'
    json_name = 'page'

    id = Property(int)
    name = Property(str)
    slug = Property(str)
