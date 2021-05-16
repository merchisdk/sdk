import sdk.python.entities
from sdk.python.entities import Property


class CartShipmentGroup(sdk.python.entities.Entity):

    resource = "/cart_shipment_groups/"
    json_name = "cartShipmentGroup"

    id = Property(int)
    items = Property("sdk.python.cart_items.CartItem")
    originAddress = Property("sdk.python.addresses.Address")
    quotes = Property("sdk.python.cart_shipment_quotes.CartShipmentQuote")
    selectedQuote = Property(
        "sdk.python.cart_shipment_quotes.CartShipmentQuote"
    )


class CartShipmentGroups(sdk.python.entities.Resource):

    entity_class = CartShipmentGroup
    json_name = "cartShipmentGroups"


cart_shipment_groups = CartShipmentGroups()
