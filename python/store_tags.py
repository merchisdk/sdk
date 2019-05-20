import sdk.python.entities
from sdk.python.stores import Store
from sdk.python.entities import Property


class StoreTag(sdk.python.entities.Entity):

    json_name = 'storeTag'
    resource = '/stores_tags/'

    id = Property(int)
    name = Property(str)
    # colour is in RRGGBB format.
    colour = Property(int)
    description = Property(str)

    store = Property(Store, backref="tags")


class StoreTags(sdk.python.entities.Resource):

    entity_class = StoreTag
    json_name = 'storeTags'


store_tags = StoreTags()
