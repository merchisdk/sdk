import sdk.python.entities
from sdk.python.entities import Property


class SupplyDomain(sdk.python.entities.Entity):

    resource = '/supply_domains/'
    json_name = 'supplyDomain'

    id = Property(int)
    product = Property('sdk.python.products.Product')
    supply_product = Property('sdk.python.products.Product')
    supply_domain = Property('sdk.python.domains.Domain')


class SupplyDomains(sdk.python.entities.Resource):

    entity_class = SupplyDomain
    json_name = 'supplyDomains'


supply_domains = SupplyDomains()