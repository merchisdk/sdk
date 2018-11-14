import sdk.python.entities
from sdk.python.product import Product
from sdk.python.domains import Domain
from sdk.python.entities import Property


class SupplyDomainAndProduct(sdk.python.entities.Entity):

    resource = '/supply_domain_and_products/'
    json_name = 'supplyDomainAndProduct'

    id = Property(int)
    product = Property(Product, backref="supplied_by_domain_products")
    supply_product = Property(Product, backref="supplied_products")
    supply_domain = Property(User, backref="supplied_products")


class SupplyDomainAndProducts(sdk.python.entities.Resource):

    entity_class = SupplyDomainAndProduct
    json_name = 'supplyDomainAndProducts'


supply_domain_and_products = SupplyDomainAndProducts()
