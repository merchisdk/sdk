import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.addresses import Address
from sdk.python.domain_tags import DomainTag
from sdk.python.users import User
from sdk.python.companies import Company
from sdk.python.invoices import Invoice
from sdk.python.shipment_methods import ShipmentMethod


class Shipment(sdk.python.entities.Entity):

    resource = '/shipments/'
    json_name = 'shipment'

    def __init__(self):
        super(Shipment, self).__init__()
        self.escape_fields = ['tax_type']

    id = Property(int)
    creation_date = Property(datetime.datetime)
    dispatched_date = Property(datetime.datetime)
    dispatch_date = Property(datetime.datetime)
    expected_receive_date = Property(datetime.datetime)
    received_date = Property(datetime.datetime)

    # Sender attributed
    sender = Property(User)
    sender_company = Property(Company)
    sender_address = Property(Address)
    sender_notes = Property(str)

    # Receiver attributes
    receiver = Property(User)
    receiver_company = Property(Company)
    receiver_address = Property(Address)
    receiver_notes = Property(str)

    invoice = Property(Invoice, backref="shipments")

    tracking_number = Property(str)
    transport_company = Property(str)

    max_weight = Property(float)
    max_volume = Property(float)
    send_sms = Property(bool)
    send_email = Property(bool)
    sender_responsible = Property(bool)

    cost = Property(float)
    tax_amount = Property(float)
    tax_type = Property(sdk.python.country_taxes.CountryTax)
    tags = Property(DomainTag, backref="shipments")
    shipment_method = Property(ShipmentMethod)


class Shipments(sdk.python.entities.Resource):

    entity_class = Shipment
    json_name = 'shipments'


shipments = Shipments()
