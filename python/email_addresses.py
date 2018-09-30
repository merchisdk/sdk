import sdk.python.entities
from sdk.python.entities import Property


class EmailAddress(sdk.python.entities.Entity):

    resource = '/email_addresses/'
    json_name = 'email_address'

    id = Property(int)
    email_address = Property(str)


class EmailAddresses(sdk.python.entities.Resource):

    entity_class = EmailAddress
    json_name = 'email_addresses'


email_addresses = EmailAddresses()
