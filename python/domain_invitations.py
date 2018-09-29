import sdk.python.entities
from sdk.python.entities import Property


class DomainInvitation(sdk.python.entities.Entity):

    resource = '/domain_invitations/'
    json_name = 'domainInvitation'

    id = Property(int)
    user_name = Property(str)
    user_email = Property(str)
    role = Property(int)


class DomainInvitations(sdk.python.entities.Resource):

    entity_class = DomainInvitation
    json_name = 'domainInvitations'


domain_invitations = DomainInvitations()
