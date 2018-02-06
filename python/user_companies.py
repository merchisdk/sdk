import sdk.python.entities
from sdk.python.companies import Company


class UserCompany(sdk.python.entities.Entity):

    resource = '/user_companies/'
    json_name = 'userCompany'

    def __init__(self):
        from sdk.python.users import User
        super(UserCompany, self).__init__()
        self.escape_fields = ['main', 'is_admin']
        self.json_property(bool, 'main')
        self.json_property(bool, 'is_admin')
        self.recursive_json_property(Company, 'company')
        self.recursive_json_property(User, 'user')


class UserCompanies(sdk.python.entities.Resource):

    entity_class = UserCompany
    json_name = 'userCompanies'


user_companies = UserCompanies()
