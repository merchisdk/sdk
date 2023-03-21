import sdk.python.entities
from sdk.python.entities import Property


class CartShipmentQuote(sdk.python.entities.Entity):

    resource = '/cart_shipment_quotes/'
    json_name = 'cartShipmentQuote'

    id = Property(int)
    name = Property(str)
    subtotal_cost = Property(float)
    tax_amount = Property(float)
    total_cost = Property(float)
    shipment_method = Property("sdk.python.shipment_methods.ShipmentMethod")
    shipment_service = Property(int)
    shipment_service_quote = Property(str)


class CartShipmentQuotes(sdk.python.entities.Resource):

    entity_class = CartShipmentQuote
    json_name = 'cartShipmentQuotes'


cart_shipment_quotes = CartShipmentQuotes()
