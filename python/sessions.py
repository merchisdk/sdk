import sdk.python.entities
from sdk.python.users import User
from sdk.python.domains import Domain


def years_to_seconds(years):
    return years * 3.15569e7


class Session(sdk.python.entities.Entity):

    primary_key = 'token'
    resource = '/sessions/'
    json_name = 'session'

    def __init__(self):
        super(Session, self).__init__()

        self.json_property(str, 'ip')
        self.recursive_json_property(User, 'user')
        self.recursive_json_property(Domain, 'domain')
        self.json_property(str, 'token')
        self.json_property(bool, 'remember')

    def cookie_ttl(self):
        if self.remember:
            return years_to_seconds(2)
        # session cookie
        return None


class Sessions(sdk.python.entities.Resource):

    entity_class = Session
    json_name = 'sessions'


sessions = Sessions()
