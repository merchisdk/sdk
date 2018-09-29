import sdk.python.entities
from sdk.python.entities import Property


class UserCompany(sdk.python.entities.Entity):

    resource = '/user_companies/'
    json_name = 'userCompany'

    def __init__(self):
        super(UserCompany, self).__init__()
        self.escape_fields = ['main', 'is_admin']

    main = Property(bool)
    is_admin = Property(bool)


class UserCompanies(sdk.python.entities.Resource):

    entity_class = UserCompany
    json_name = 'userCompanies'


user_companies = UserCompanies()
