import sdk.python.entities
from sdk.python.assignments import Assignment
from sdk.python.jobs import Job
from sdk.python.entities import Property


class ShipmentItemFulfillment(sdk.python.entities.Entity):

    resource = '/shipment_item_fulfillments/'
    json_name = 'shipmentItemFulfillment'

    assignment = Property(Assignment)
    job = Property(Job)
