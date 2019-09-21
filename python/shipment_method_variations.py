import sdk.python.entities
from sdk.python.entities import Property


class ShipmentMethodVariation(sdk.python.entities.Entity):

    resource = '/shipment_method_variations/'
    json_name = 'shipmentMethodVariation'

    id = Property(int)
    destination_country = Property(str)
    destination_state = Property(str)
    cost = Property(float)
    currency = Property(str)
    max_weight = Property(float)
    tax_type = Property(sdk.python.country_taxes.CountryTax)


class ShipmentMethodVariations(sdk.python.entities.Resource):

    entity_class = ShipmentMethodVariation
    json_name = 'shipmentMethodVariations'


shipment_method_variations = ShipmentMethodVariations()