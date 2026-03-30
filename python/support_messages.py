"""Support message entity for domain support chat."""

import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.users import User


class SupportMessage(sdk.python.entities.Entity):
    """A single message in a support conversation. sender_type is 'guest' or 'manager'."""

    # List/create under a conversation: /support_conversations/<id>/support_messages/
    resource = '/support_messages/'
    json_name = 'supportMessage'

    id = Property(int)
    conversation = Property("sdk.python.support_conversations.SupportConversation")
    sender_type = Property(str)  # 'guest' | 'manager'
    user = Property(User)
    content = Property(str)
    creation_date = Property(datetime.datetime)


class SupportMessages(sdk.python.entities.Resource):
    """Resource for support messages (scoped to a conversation)."""

    entity_class = SupportMessage
    json_name = 'supportMessages'


support_messages = SupportMessages()
