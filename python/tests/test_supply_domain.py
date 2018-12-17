from sdk.python.supply_domains import SupplyDomain
from sdk.python.products import Product
from sdk.python.domains import Domain


def test_supply_domain_from_json_works():
    supply_domain = SupplyDomain()
    supply_domain_json = {
        'supplyDomain': {
            'id': 42,
            'product': {'id': 1, 'notes': 'this is product'},
            'supplyProduct': {'id': 2, 'notes': 'this is supply product'},
            'domain': {'id': 3, 'domain': 'domain.com'}
        }
    }
    supply_domain.from_json(supply_domain_json)
    assert supply_domain.id == 42
    assert supply_domain.product.id == 1
    assert supply_domain.product.notes == 'this is product'
    assert supply_domain.supply_product.id == 2
    assert supply_domain.supply_product.notes == 'this is supply product'
    assert supply_domain.domain.id == 3
    assert supply_domain.domain.domain == 'domain.com'


def test_supply_domain_backref_valid():
    product = Product()
    # ensure product supply_domains and supplied_by_domains attributes exists
    try:
        assert product.supply_domains is None
        assert product.supplied_by_domains is None
    except AttributeError:
        assert False

    domain = Domain()
    # ensure domain supply_products attributes exists
    try:
        assert domain.supply_products is None
    except AttributeError:
        assert False
