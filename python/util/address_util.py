import pycountry
from sdk.python.util.api_error import ApiError
from sdk.python.util.errors import BAD_COUNTRY


def address_country(code):
    """ Take a 2 char country code like 'AU' and return the associated country
        name, i.e. 'Australia' as a string
    """
    country_name = pycountry.countries.get(alpha_2=code)
    return country_name.name


def name_primary(counter, name):
    """ Add '(Primary)' onto a address name if the address is set
        as primary
    """
    if counter == 0:
        name += " (Primary)"
    return name


def validate_country_code(country_code, raise_error=False):
    """ Validate whether a country code like 'AU' is a valid country code """
    try:
        pycountry.countries.get(alpha_2=country_code)
    except KeyError:
        if raise_error:
            err = "'{}' is not an ISO 3166-1 alpha-2 country code"
            err = err.format(country_code)
            raise ApiError(err, 400, BAD_COUNTRY)
        return False
    return True
