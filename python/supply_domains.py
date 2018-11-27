import sdk.python.entities
from sdk.python.entities import Property


class SupplyDomain(sdk.python.entities.Entity):

    resource = '/supply_domains/'
    json_name = 'supplyDomain'

    id = Property(int)
    product = Property('sdk.python.product.Product',
                       backref="supplied_by_domains")
    supply_product = Property('sdk.python.product.Product',
                              backref="supply_domains")
    supply_domain = Property('sdk.python.product.Product',
                             backref="supply_products")


class SupplyDomains(sdk.python.entities.Resource):

    entity_class = SupplyDomain
    json_name = 'supplyDomains'


supply_domains = SupplyDomains()
