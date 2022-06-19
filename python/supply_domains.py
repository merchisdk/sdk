import sdk.python.entities
from sdk.python.entities import Property


class SupplyDomain(sdk.python.entities.Entity):

    resource = '/supply_domains/'
    json_name = 'supplyDomain'

    id = Property(int)
    needs_drafting = Property(bool)
    product = Property('sdk.python.products.Product',
                       backref='supply_domains')
    supply_product = Property('sdk.python.products.Product',
                              backref='supplied_by_domains')
    domain = Property('sdk.python.domains.Domain', backref='supply_products')


class SupplyDomains(sdk.python.entities.Resource):

    entity_class = SupplyDomain
    json_name = 'supplyDomains'


supply_domains = SupplyDomains()
