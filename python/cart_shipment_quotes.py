import sdk.python.entities
from sdk.python.entities import Property


class CartShipmentQuote(sdk.python.entities.Entity):

    resource = '/cart_shipment_quotes/'
    json_name = 'cartShipmentQuote'

    id = Property(int)
    subtotal_cost = Property(float)
    tax_amount = Property(float)
    total_cost = Property(float)
    shipment_method = Property("sdk.python.shipment_method.ShipmentMethod")


class CartShipmentQuotes(sdk.python.entities.Resource):

    entity_class = CartShipmentQuote
    json_name = 'cartShipmentQuotes'


cart_shipment_quotes = CartShipmentQuotes()
