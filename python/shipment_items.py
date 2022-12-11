import sdk.python.entities
from sdk.python.assignments import Assignment
from sdk.python.jobs import Job
from sdk.python.entities import Property


class ShipmentItem(sdk.python.entities.Entity):

    resource = '/shipment_items/'
    json_name = 'shipmentItem'

    job = Property(Job)
    fulfillments = Property(Job or Assignment)


class ShipmentItems(sdk.python.entities.Resource):

    entity_class = ShipmentItem
    json_name = 'shipmentItems'


shipment_items = ShipmentItems()
