import datetime
import sdk.python.entities
from sdk.python.entities import Property


class ShipmentLog(sdk.python.entities.Entity):

    resource = '/shipment_logs/'
    json_name = 'shipmentLog'

    id = Property(int)
    shipment_id = Property(int)
    shipment = Property('sdk.python.shipments.Shipment')
    user = Property('sdk.python.users.User')
    source_type = Property(str)
    message = Property(str)
    created_at = Property(datetime.datetime)


class ShipmentLogs(sdk.python.entities.Resource):

    entity_class = ShipmentLog
    json_name = 'shipmentLogs'


shipment_logs = ShipmentLogs()
