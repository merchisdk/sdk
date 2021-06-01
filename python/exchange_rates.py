import datetime
import sdk.python.entities
from sdk.python.entities import Property


class ExchangeRate(sdk.python.entities.Entity):

    resource = '/exchange_rates/'
    json_name = 'exchangeRate'

    id = Property(int)
    from_currency = Property(str)
    to_currency = Property(str)
    rate = Property(str)
    last_updated = Property(datetime.datetime)


class ExchangeRates(sdk.python.entities.Resource):

    entity_class = ExchangeRate
    json_name = 'exchangeRates'


exchange_rates = ExchangeRates()
