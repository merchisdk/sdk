from sdk.python.products import Product


def test_product_has_origin_address_attribute():
    product = Product()
    assert not product.origin_address
