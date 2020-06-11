import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.jobs import Job
from sdk.python.products import Product


class Inventory(sdk.python.entities.Entity):

    resource = '/inventories/'
    json_name = 'inventory'

    id = Property(int)
    quantity = Property(int)
    name = Property(str)
    notes = Property(str)
    product = Property(Product, backref="inventory")
    jobs = Property(Job, backref="inventory")


class Inventories(sdk.python.entities.Resource):

    entity_class = Inventory
    json_name = 'inventory'


inventories = Inventories()
