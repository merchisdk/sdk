import sdk.python.entities
from sdk.python.companies import Company
from sdk.python.entities import Property


class PaymentDevice(sdk.python.entities.Entity):

    json_name = 'paymentDevice'
    resource = '/payment_devices/'

    id = Property(int)
    code = Property(str)
    device_id = Property(str)
    square_id = Property(str)
    device_data = Property(str)

    company = Property(Company, backref="payment_devices")


class PaymentDevices(sdk.python.entities.Resource):

    entity_class = PaymentDevice
    json_name = 'paymentDevices'


payment_devices = PaymentDevices()
