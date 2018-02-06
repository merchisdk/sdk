import sdk.python.entities


class PhoneNumber(sdk.python.entities.Entity):
    """ merchi python SDK object represent telephone numbers.

        Users and Companies are examples of entities which may have telephone
        numbers.

        The telephone number and (area) code are stored seperately, but they are
        both supplied as with type str, there is no other structure. Nonetheless
        the merchi backend is internally aware of more structure, and will not
        accept a telephone number which could not possibly be a valid format,
        or is not assigned to anyone.

        Methods for making requests to get or update the PhoneNumber are
        inherited from sdk.python.entities.Entity.
    """

    resource = '/phone_numbers/'
    json_name = 'phone_number'

    def __init__(self):
        super(PhoneNumber, self).__init__()
        self.escape_fields = ['code']

        self.json_property(int, 'id')
        self.json_property(str, 'number')
        self.json_property(str, 'code')
        self.json_property(str, 'local_format_number')
        self.json_property(str, 'international_format_number')


class PhoneNumbers(sdk.python.entities.Resource):

    entity_class = PhoneNumber
    json_name = 'phone_numbers'


phone_numbers = PhoneNumbers()
