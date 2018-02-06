import sdk.python.entities
from sdk.python.addresses import Address


class Bank(sdk.python.entities.Entity):

    resource = '/banks/'
    json_name = 'bank'

    def __init__(self):
        super(Bank, self).__init__()
        self.escape_fields = ['default']
        self.json_property(int, 'id')
        self.json_property(bool, 'default')
        self.json_property(str, 'bank_name')
        self.json_property(str, 'account_number')
        self.json_property(str, 'bsb')
        self.json_property(str, 'swift_code')
        self.json_property(str, 'iban')
        self.json_property(str, 'bank_code')
        self.recursive_json_property(Address, 'bank_address')
