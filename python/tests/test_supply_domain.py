from sdk.python.supply_stores import SupplyStore
from sdk.python.products import Product
from sdk.python.stores import Store


def test_supply_store_from_json_works():
    supply_store = SupplyStore()
    supply_store_json = {
        'supplyStore': {
            'id': 42,
            'product': {'id': 1, 'notes': 'this is product'},
            'supplyProduct': {'id': 2, 'notes': 'this is supply product'},
            'store': {'id': 3, 'store': 'store.com'}
        }
    }
    supply_store.from_json(supply_store_json)
    assert supply_store.id == 42
    assert supply_store.product.id == 1
    assert supply_store.product.notes == 'this is product'
    assert supply_store.supply_product.id == 2
    assert supply_store.supply_product.notes == 'this is supply product'
    assert supply_store.store.id == 3
    assert supply_store.store.domain == 'store.com'


def test_supply_store_backref_valid():
    product = Product()
    # ensure product supply_stores and supplied_by_stores attributes exists
    try:
        assert product.supply_stores is None
        assert product.supplied_by_stores is None
    except AttributeError:
        assert False

    store = Store()
    # ensure store supply_products attributes exists
    try:
        assert store.supply_products is None
    except AttributeError:
        assert False
