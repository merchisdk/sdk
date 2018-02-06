import sdk.python.entities
from sdk.python.companies import Company
from sdk.python.users import User


class CompanyInvitation(sdk.python.entities.Entity):

    resource = '/company_invitations/'
    json_name = 'companyInvitation'

    def __init__(self):
        super(CompanyInvitation, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'token')
        self.json_property(str, 'user_name')
        self.json_property(str, 'user_email')
        self.json_property(bool, "invite_as_admin")
        self.recursive_json_property(Company, 'company')
        self.recursive_json_property(User, 'sender')


class CompanyInvitations(sdk.python.entities.Resource):

    entity_class = CompanyInvitation
    json_name = 'companyInvitations'


company_invitations = CompanyInvitations()
