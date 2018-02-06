import pycountry
import sdk.python.entities


class Address(sdk.python.entities.Entity):

    resource = '/addresses/'
    json_name = 'address'

    def __init__(self):
        super(Address, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'line_one')
        self.json_property(str, 'line_two')
        self.json_property(str, 'city')
        self.json_property(str, 'state')
        self.json_property(str, 'country')
        self.json_property(str, 'postcode')

    def __repr__(self):
        return "{},{},{},{},{}".format(self.line_one,
                                       self.city,
                                       self.state,
                                       self.country,
                                       self.postcode)

    def clone(self):
        clone_address = Address()
        for json_name in self.json_properties:
            setattr(clone_address, json_name,
                    (getattr(self, json_name)))
        clone_address.id = None
        return clone_address

    def country_name(self):
        """ Convert the country initials into
            the country full name and returns the country
            full name
        """
        country_name = self.country
        try:
            country_name = pycountry.countries.\
                get(alpha2=self.country).name
        except KeyError:
            pass
        return country_name


class Addresses(sdk.python.entities.Resource):

    entity_class = Address
    json_name = 'addresses'


addresses = Addresses()
