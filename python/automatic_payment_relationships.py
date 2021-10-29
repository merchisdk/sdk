import datetime
import sdk.python.entities
from sdk.python.companies import Company
from sdk.python.entities import Property


class AutomaticPaymentRelationship(sdk.python.entities.Entity):

    resource = '/automatic_payment_relationships/'
    json_name = 'automaticPaymentRelationship'

    archived = Property(datetime.datetime)
    id = Property(int)
    creation_date = Property(datetime.datetime)
    company_customer = Property(Company)
    company_supplier = Property(Company)
    stripe_customer_id = Property(str)


class AutomaticPaymentRelationships(sdk.python.entities.Resource):

    entity_class = AutomaticPaymentRelationship
    json_name = 'automaticPaymentRelationships'


automaticPaymentRelationships = AutomaticPaymentRelationships()
