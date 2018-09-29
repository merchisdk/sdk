import sdk.python.entities
from sdk.python.companies import Company
from sdk.python.users import User
from sdk.python.entities import Property


class CompanyInvitation(sdk.python.entities.Entity):

    resource = '/company_invitations/'
    json_name = 'companyInvitation'

    id = Property(int)
    token = Property(str)
    user_name = Property(str)
    user_email = Property(str)
    invite_as_admin = Property(bool)
    company = Property(Company, backref="company_invitations")
    sender = Property(User)


class CompanyInvitations(sdk.python.entities.Resource):

    entity_class = CompanyInvitation
    json_name = 'companyInvitations'


company_invitations = CompanyInvitations()
