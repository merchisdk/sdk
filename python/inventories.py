import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.jobs import Job
from sdk.python.products import Product
from sdk.python.variations import VariationsGroup, VariationFieldOption


class Inventory(sdk.python.entities.Entity):

    resource = '/inventories/'
    json_name = 'inventory'

    id = Property(int)
    quantity = Property(int)
    name = Property(str)
    notes = Property(str)
    is_orphan = Property(bool)
    inventory_groups = Property(
        "sdk.python.inventory_groups.InventoryGroups")
    inventory_unit_variations = Property(
        "sdk.python.inventories.InventoryUnitVariation")
    products = Property(Product, backref="inventories")


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


class InventoryUnitVariation(sdk.python.entities.Entity):

    resource = '/inventory_unit_variations/'
    json_name = 'inventory_unit_variation'

    archived = Property(datetime.datetime)
    id = Property(int)
    inventory = Property(Inventory)
    variation_fields_option = Property(VariationFieldOption)

    def option_id(self):
        if self.variation_fields_option is None:
            raise ValueError(
                'variation_fields_option is None, did you forget to embed it?')
        return self.variation_fields_option.id
