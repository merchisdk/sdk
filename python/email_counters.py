import sdk.python.entities
from sdk.python.entities import Property


class EmailCounter(sdk.python.entities.Entity):

    resource = '/email_counters/'
    json_name = 'emailCounter'
    primary_key = 'email_address'

    email_address = Property(str)
    unsubscribed = Property(bool)
    silenced = Property(bool)
    tokens = Property(int)


class EmailCounters(sdk.python.entities.Resource):

    entity_class = EmailCounter
    json_name = 'emailCounters'


email_counters = EmailCounters()
