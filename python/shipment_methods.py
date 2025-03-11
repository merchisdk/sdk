import sdk.python.entities
from sdk.python.addresses import Address
from sdk.python.entities import Property
from sdk.python.shipment_method_variations import ShipmentMethodVariation


class ShipmentMethod(sdk.python.entities.Entity):

    resource = '/shipment_methods/'
    json_name = 'shipmentMethod'

    id = Property(int)
    name = Property(str)
    shipment_service = Property(int)
    pick_up = Property(bool)
    origin_address = Property(Address)
    company = Property("sdk.python.companies.Company")
    domain = Property("sdk.python.domains.Domain")
    company_default = Property(bool)
    default_cost = Property(float)
    currency = Property(str)
    buy_cost = Property(float)
    buy_currency = Property(str)
    company_default = Property(bool)
    transport_company = Property(str)
    transport_company_name = Property(int)
    tax_type = Property('sdk.python.country_taxes.CountryTax')
    variations = Property(ShipmentMethodVariation)


class ShipmentMethods(sdk.python.entities.Resource):

    entity_class = ShipmentMethod
    json_name = 'shipmentMethods'


shipment_methods = ShipmentMethods()
