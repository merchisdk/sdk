import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.addresses import Address
from sdk.python.domain_tags import DomainTag
from sdk.python.users import User
from sdk.python.companies import Company
from sdk.python.files import File
from sdk.python.shipment_items import ShipmentItem
from sdk.python.shipment_methods import ShipmentMethod


class Shipment(sdk.python.entities.Entity):

    resource = '/shipments/'
    json_name = 'shipment'

    def __init__(self):
        super(Shipment, self).__init__()
        self.escape_fields = ['tax_type']

    id = Property(int)
    name = Property(str)
    shipment_service_booking_info = Property(str)
    shipment_service_quote = Property(str)
    shipment_label = Property(File)
    creation_date = Property(datetime.datetime)
    dispatched_date = Property(datetime.datetime)
    dispatch_date = Property(datetime.datetime)
    expected_receive_date = Property(datetime.datetime)
    received_date = Property(datetime.datetime)

    # on behalf of attributes
    on_behalf_of = Property(User)
    on_behalf_of_company = Property(Company)

    # Sender attributes
    sender = Property(User)
    sender_company = Property(Company)
    sender_address = Property(Address)
    sender_notes = Property(str)

    # Receiver attributes
    blind_ship_to = Property(str)
    receiver = Property(User)
    receiver_company = Property(Company)
    receiver_address = Property(Address)
    receiver_notes = Property(str)

    invoices = Property(
        'sdk.python.invoices.Invoice',
        backref="shipments")

    tracking_number = Property(str)
    transport_company = Property(int)
    transport_company_name = Property(str)

    max_weight = Property(float)
    max_volume = Property(float)
    send_sms = Property(bool)
    send_email = Property(bool)
    sender_responsible = Property(bool)

    cost = Property(float)
    tax_amount = Property(float)
    buy_cost = Property(float)
    buy_currency = Property(str)
    tax_type = Property(sdk.python.country_taxes.CountryTax)
    tags = Property(DomainTag, backref="shipments")
    shipment_items = Property(ShipmentItem)
    shipment_method = Property(ShipmentMethod)


class Shipments(sdk.python.entities.Resource):

    entity_class = Shipment
    json_name = 'shipments'


shipments = Shipments()
