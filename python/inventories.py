import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.jobs import Job
from sdk.python.products import Product
from sdk.python.variations import VariationsGroup


class Inventory(sdk.python.entities.Entity):

    resource = '/inventories/'
    json_name = 'inventory'

    id = Property(int)
    quantity = Property(int)
    name = Property(str)
    notes = Property(str)
    product = Property(Product, backref="inventory")


class Inventories(sdk.python.entities.Resource):

    entity_class = Inventory
    json_name = 'inventory'


inventories = Inventories()


class MatchingInventory(sdk.python.entities.Entity):

    resource = '/matching_inventories/'
    json_name = 'matching_inventory'

    status = Property(int)
    deduction_date = Property(datetime.datetime)
    job = Property(Job, backref="matching_inventories")
    group = Property(VariationsGroup, backref="matching_inventory")
    inventory = Property(Inventory)
