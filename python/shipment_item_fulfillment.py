import sdk.python.entities
from sdk.python.entities import Property


class ShipmentItemFulfillment(sdk.python.entities.Entity):

    resource = '/shipment_item_fulfillments/'
    json_name = 'shipmentItemFulfillment'

    assignment = Property('sdk.python.assignments.Assignment')
    job = Property('sdk.python.jobs.Job')
