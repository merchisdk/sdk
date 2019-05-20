import sdk.python.entities
from sdk.python.stores import Store
from sdk.python.entities import Property


class Category(sdk.python.entities.Entity):

    resource = '/categories/'
    json_name = 'category'

    id = Property(int)
    name = Property(str)
    show_dashboard = Property(bool)
    show_public = Property(bool)
    store = Property(Store, backref="categories")


class Categories(sdk.python.entities.Resource):

    entity_class = Category
    json_name = 'categories'


categories = Categories()
