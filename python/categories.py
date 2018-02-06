import sdk.python.entities
from sdk.python.domains import Domain


class Category(sdk.python.entities.Entity):

    resource = '/categories/'
    json_name = 'category'

    def __init__(self):
        super(Category, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(bool, "show_dashboard")
        self.json_property(bool, "show_public")
        self.recursive_json_property(Domain, 'domain')


class Categories(sdk.python.entities.Resource):

    entity_class = Category
    json_name = 'categories'


categories = Categories()
