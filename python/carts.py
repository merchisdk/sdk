import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.users import User
from sdk.python.domains import Domain
from sdk.python.shipments import Shipment
from sdk.python.companies import Company
from sdk.python.cart_items import CartItem


class Cart(sdk.python.entities.Entity):

    resource = '/carts/'
    json_name = 'cart'

    creation_date = Property(datetime.datetime)
    id = Property(int)
    ip = Property(str)
    token = Property(str)
    cost = Property(float)
    client = Property(User)
    client_company = Property(Company)
    domain = Property(Domain)
    shipment = Property(Shipment)
    cart_items = Property(CartItem, backref="cart")


class Carts(sdk.python.entities.Resource):

    entity_class = Cart
    json_name = 'carts'


carts = Carts()
