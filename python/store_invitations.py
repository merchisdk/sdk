import sdk.python.entities
from sdk.python.entities import Property


class StoreInvitation(sdk.python.entities.Entity):

    resource = '/store_invitations/'
    json_name = 'storeInvitation'

    id = Property(int)
    user_name = Property(str)
    user_email = Property(str)
    role = Property(int)


class StoreInvitations(sdk.python.entities.Resource):

    entity_class = StoreInvitation
    json_name = 'storeInvitations'


store_invitations = StoreInvitations()
