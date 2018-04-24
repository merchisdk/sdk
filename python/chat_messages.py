import sdk.python.entities
from sdk.python.users import User


class ChatMessage(sdk.python.entities.Entity):

    resource = '/chat_messages/'
    json_name = 'chatMessage'

    def __init__(self):
        super(ChatMessage, self).__init__()

        self.json_property(int, 'received')
        self.json_property(str, 'message')
        self.recursive_json_property(User, 'recipient_id')
        self.recursive_json_property(User, 'sender_id')


class ChatMessages(sdk.python.entities.Resource):

    entity_class = ChatMessage
    json_name = 'chatMessages'


chat_messsages = ChatMessages()
