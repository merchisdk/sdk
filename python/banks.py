import sdk.python.entities
from sdk.python.addresses import Address
from sdk.python.entities import Property


class Bank(sdk.python.entities.Entity):

    resource = '/banks/'
    json_name = 'bank'

    id = Property(int)
    default = Property(bool)
    bank_name = Property(str)
    account_number = Property(str)
    account_name = Property(str)
    bsb = Property(str)
    swift_code = Property(str)
    iban = Property(str)
    bank_code = Property(str)
    bank_address = Property(Address)

    def __init__(self):
        super(Bank, self).__init__()
        self.escape_fields = ['default']
