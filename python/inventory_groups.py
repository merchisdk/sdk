import datetime
import sdk.python.entities
from sdk.python.entities import Property


class InventoryGroup(sdk.python.entities.Entity):

    resource = '/inventory_groups/'
    json_name = 'inventoryGroup'

    archived = Property(datetime.datetime)
    id = Property(int)
    name = Property(str)
    inventories = Property("sdk.python.invoices.Inventories")
    products = Property("sdk.python.products.Products")
    jobs = Property("sdk.python.jobs.Jobs")
    variation_fields = Property(
        "sdk.python.variation_fields.VariationFields")


class InventoryGroups(sdk.python.entities.Resource):

    entity_class = InventoryGroup
    json_name = 'inventoryGroups'


inventory_groups = InventoryGroups()
