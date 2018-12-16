from sdk.python.supply_domains import SupplyDomain


def test_supply_domain_from_json_works():
    supply_domain = SupplyDomain()
    supply_domain_json = {
        'supplyDomain': {
            'id': 42,
            'product': {'id': 1},
            'supplyProduct': {'id': 2},
            'domain': {'id': 3}
        }
    }
    supply_domain.from_json(supply_domain_json)
    assert supply_domain.id == 42
    assert supply_domain.product.id == 1
    assert supply_domain.supply_product.id == 2
    assert supply_domain.domain.id == 3
