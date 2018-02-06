import sdk.python.entities


class EmailAddress(sdk.python.entities.Entity):

    resource = '/email_addresses/'
    json_name = 'email_address'

    def __init__(self):
        super(EmailAddress, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'email_address')


class EmailAddresses(sdk.python.entities.Resource):

    entity_class = EmailAddress
    json_name = 'email_addresses'


email_addresses = EmailAddresses()
