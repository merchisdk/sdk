import pycountry


def address_country(code):
    """ Take a 2 char country code like 'AU' and return the associated country
        name, i.e. 'Australia' as a string
    """
    country_name = pycountry.countries.get(alpha_2=code)
    if not country_name:
        return ''
    return country_name.name


def name_primary(counter, name):
    """ Add '(Primary)' onto a address name if the address is set
        as primary
    """
    if counter == 0:
        name += " (Primary)"
    return name
