import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.users import User
from sdk.python.domains import Domain


class AgentConversation(sdk.python.entities.Entity):

    resource = '/agent_conversations/'
    json_name = 'agentConversation'

    id = Property(int)
    conversation_id = Property(str)
    initial_prompt = Property(str)
    creation_date = Property(datetime.datetime)
    service_provider = Property(int)
    user = Property(User)
    domain = Property(Domain)


class AgentConversations(sdk.python.entities.Resource):

    entity_class = AgentConversation
    json_name = 'agentConversations'


agent_conversations = AgentConversations()
