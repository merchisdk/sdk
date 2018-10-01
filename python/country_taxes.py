import pycountry
import sdk.python.entities
from sdk.python.entities import Property


class CountryTax(sdk.python.entities.Entity):

    resource = '/country_taxes/'
    json_name = 'countryTax'

    id = Property(int)
    country = Property(str)
    tax_name = Property(str)
    tax_percent = Property(float)

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
