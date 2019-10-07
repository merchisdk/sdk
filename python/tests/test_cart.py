from sdk.python.cart_shipment_groups import CartShipmentGroup
from sdk.python.cart_shipment_quotes import CartShipmentQuote


def test_cart_shipment_quote_has_shipment_method():
    cart_shipment_quote = CartShipmentQuote()
    assert cart_shipment_quote.shipment_method is None


def test_cart_shipment_group_has_items():
    cart_shipment_group = CartShipmentGroup()
    assert cart_shipment_group.items is None
