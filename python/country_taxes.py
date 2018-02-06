import pycountry
import sdk.python.entities


class CountryTax(sdk.python.entities.Entity):

    resource = '/country_taxes/'
    json_name = 'countryTax'

    def __init__(self):
        super(CountryTax, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'country')
        self.json_property(str, 'tax_name')
        self.json_property(float, 'tax_percent')

    def country_name(self):
        if not self.country:
            return "World Wide"
        return pycountry.countries.get(alpha_2=self.country).name

    @property
    def full_name(self):
        return "{} ({})".format(self.tax_name, self.country_name())


class CountryTaxes(sdk.python.entities.Resource):

    entity_class = CountryTax
    json_name = 'countryTaxes'


country_taxes = CountryTaxes()
