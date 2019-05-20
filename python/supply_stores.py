import sdk.python.entities
from sdk.python.entities import Property


class SupplyStore(sdk.python.entities.Entity):

    resource = '/supply_stores/'
    json_name = 'supplyStore'

    id = Property(int)
    product = Property('sdk.python.products.Product',
                       backref='supply_stores')
    supply_product = Property('sdk.python.products.Product',
                              backref='supplied_by_stores')
    store = Property('sdk.python.stores.Store', backref='supply_products')


class SupplyStores(sdk.python.entities.Resource):

    entity_class = SupplyStore
    json_name = 'supplyStores'


supply_stores = SupplyStores()
