import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.variations import Variation, VariationsGroup
from sdk.python.country_taxes import CountryTax


class CartItem(sdk.python.entities.Entity):

    resource = '/cart_items/'
    json_name = 'cartItem'

    creation_date = Property(datetime.datetime)
    id = Property(int)
    quantity = Property(int)
    total_cost = Property(float)
    subtotal_cost = Property(float)
    tax_amount = Property(float)
    currency = Property(str)
    notes = Property(str)
    tax_type = Property(CountryTax)
    product = Property('sdk.python.products.Product')
    variations_groups = Property(VariationsGroup)
    variations = Property(Variation)


class CartItems(sdk.python.entities.Resource):

    entity_class = CartItem
    json_name = 'cartItems'


cart_items = CartItems()
