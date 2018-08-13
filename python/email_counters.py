import sdk.python.entities


class EmailCounter(sdk.python.entities.Entity):

    resource = '/email_counters/'
    json_name = 'emailCounter'
    primary_key = 'email_address'

    def __init__(self):
        super(EmailCounter, self).__init__()

        self.json_property(str, 'email_address')
        self.json_property(bool, "unsubscribed")
        self.json_property(bool, "silenced")
        self.json_property(int, "tokens")


class EmailCounters(sdk.python.entities.Resource):

    entity_class = EmailCounter
    json_name = 'emailCounters'


email_counters = EmailCounters()
