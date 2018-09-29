import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.users import User
from sdk.python.domains import Domain


def years_to_seconds(years):
    return years * 3.15569e7


class Session(sdk.python.entities.Entity):

    primary_key = 'token'
    resource = '/sessions/'
    json_name = 'session'

    ip = Property(str)
    user = Property(User)
    domain = Property(Domain)
    token = Property(str)
    remember = Property(bool)

    def cookie_ttl(self):
        if self.remember:
            return years_to_seconds(2)
        # session cookie
        return None


class Sessions(sdk.python.entities.Resource):

    entity_class = Session
    json_name = 'sessions'


sessions = Sessions()
