import datetime
import sdk.python.entities
from sdk.python.addresses import Address
from sdk.python.users import User
from sdk.python.companies import Company
from sdk.python.invoices import Invoice


class Shipment(sdk.python.entities.Entity):

    resource = '/shipments/'
    json_name = 'shipment'

    def __init__(self):
        super(Shipment, self).__init__()
        self.escape_fields = ['tax_type']

        self.json_property(int, 'id')
        self.json_property(datetime.datetime, 'creation_date')
        self.json_property(datetime.datetime, 'dispatched_date')
        self.json_property(datetime.datetime, 'dispatch_date')
        self.json_property(datetime.datetime, 'expected_receive_date')
        self.json_property(datetime.datetime, 'received_date')

        # Sender attributed
        self.recursive_json_property(User, 'sender')
        self.recursive_json_property(Company, 'sender_company')
        self.recursive_json_property(Address, 'sender_address')
        self.json_property(str, 'sender_notes')

        # Receiver attributes
        self.recursive_json_property(User, 'receiver')
        self.recursive_json_property(Company, 'receiver_company')
        self.recursive_json_property(Address, 'receiver_address')
        self.json_property(str, 'receiver_notes')

        self.recursive_json_property(Invoice, 'invoice')
        self.recursive_json_property(sdk.python.jobs.Job, 'jobs')
        self.recursive_json_property(sdk.python.jobs.Assignment, 'assignments')

        self.json_property(str, 'tracking_number')
        self.json_property(str, 'transport_company')

        self.json_property(float, 'max_weight')
        self.json_property(float, 'max_volume')
        self.json_property(bool, 'send_sms')
        self.json_property(bool, 'send_email')
        self.json_property(bool, 'sender_responsible')

        self.json_property(float, 'cost')
        self.json_property(float, 'tax_amount')
        self.recursive_json_property(sdk.python.country_taxes.CountryTax,
                                     'tax_type')


class Shipments(sdk.python.entities.Resource):

    entity_class = Shipment
    json_name = 'shipments'


shipments = Shipments()
