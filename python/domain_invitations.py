import sdk.python.entities


class DomainInvitation(sdk.python.entities.Entity):

    resource = '/domain_invitations/'
    json_name = 'domainInvitation'

    def __init__(self):
        from sdk.python.domains import Domain
        from sdk.python.users import User
        super(DomainInvitation, self).__init__()
        self.json_property(int, 'id')
        self.json_property(str, 'user_name')
        self.json_property(str, 'user_email')
        self.json_property(int, 'role')
        self.recursive_json_property(Domain, 'domain')
        self.recursive_json_property(User, 'sender')
        self.recursive_json_property(User, 'user')


class DomainInvitations(sdk.python.entities.Resource):

    entity_class = DomainInvitation
    json_name = 'domainInvitations'


domain_invitations = DomainInvitations()
