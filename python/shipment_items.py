import sdk.python.entities
from sdk.python.jobs import Job
from sdk.python.shipment_item_fulfillment import ShipmentItemFulfillment
from sdk.python.entities import Property


class ShipmentItem(sdk.python.entities.Entity):

    resource = '/shipment_items/'
    json_name = 'shipmentItem'

    job = Property(Job)
    fulfillments = Property(ShipmentItemFulfillment)


class ShipmentItems(sdk.python.entities.Resource):

    entity_class = ShipmentItem
    json_name = 'shipmentItems'


shipment_items = ShipmentItems()
