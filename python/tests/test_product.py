from sdk.python.products import Product


def test_product_not_has_origin_address_attribute():
    product = Product()
    assert not hasattr(product, 'origin_address')
