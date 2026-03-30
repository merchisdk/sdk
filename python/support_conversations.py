"""Support conversation entity for domain support chat."""

import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.domains import Domain
from sdk.python.domain_tags import DomainTag
from sdk.python.users import User


class SupportConversation(sdk.python.entities.Entity):
    """One conversation per (domain, guest) or (domain, user) for the support chat widget."""

    resource = '/support_conversations/'
    json_name = 'supportConversation'

    id = Property(int)
    domain = Property(Domain)
    guest_id = Property(str)
    guest_contact_email = Property(str)
    guest_contact_name = Property(str)
    client_fingerprint = Property(str)
    user = Property(User)
    creation_date = Property(datetime.datetime)
    last_message_at = Property(datetime.datetime)
    archived_at = Property(datetime.datetime)
    tags = Property(DomainTag, backref="support_conversations")
    messages = Property("sdk.python.support_messages.SupportMessage")


class SupportConversations(sdk.python.entities.Resource):
    """Resource for support conversations."""

    entity_class = SupportConversation
    json_name = 'supportConversations'


support_conversations = SupportConversations()
