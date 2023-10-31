import sdk.python.entities
from sdk.python.companies import Company
from sdk.python.domains import Domain
from sdk.python.invoices import Invoice
from sdk.python.jobs import Job
from sdk.python.products import Product
from sdk.python.entities import Property
from sdk.python.shipments import Shipment
from sdk.python.themes import Theme
from sdk.python.users import User


class InternalTag(sdk.python.entities.Entity):

    json_name = 'internalTag'
    resource = '/internal_tags/'

    id = Property(int)
    name = Property(str)
    # colour is in RRGGBB format.
    colour = Property(str)
    description = Property(str)

    companies = Property(Company, backref="internal_tags")
    domains = Property(Domain, backref="internal_tags")
    invoices = Property(Invoice, backref="internal_tags")
    jobs = Property(Job, backref="internal_tags")
    products = Property(Product, backref="internal_tags")
    shipments = Property(Shipment, backref="internal_tags")
    themes = Property(Theme, backref="internal_tags")
    users = Property(User, backref="internal_tags")


class InternalTags(sdk.python.entities.Resource):

    entity_class = InternalTag
    json_name = 'internalTags'


internal_tags = InternalTags()
