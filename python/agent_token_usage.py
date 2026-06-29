import datetime

import sdk.python.entities
from sdk.python.entities import Property


class AgentTokenUsage(sdk.python.entities.Entity):

    resource = '/agent_token_usage/'
    json_name = 'agentTokenUsage'

    id = Property(int)
    created_at = Property(datetime.datetime)
    company_id = Property(int)
    domain_id = Property(int)
    user_id = Property(int)
    company = Property('sdk.python.companies.Company')
    domain = Property('sdk.python.domains.Domain')
    user = Property('sdk.python.users.User')
    agent_conversation = Property('sdk.python.agent_conversations.AgentConversation')
    support_conversation = Property(
        'sdk.python.support_conversations.SupportConversation'
    )
    agent_conversation_id = Property(int)
    support_conversation_id = Property(int)
    source_type = Property(str)
    model_name = Property(str)
    prompt_tokens = Property(int)
    completion_tokens = Property(int)
    total_tokens = Property(int)


class AgentTokenUsages(sdk.python.entities.Resource):

    entity_class = AgentTokenUsage
    json_name = 'agentTokenUsage'

    def record(self, data=None, **kwargs):
        request = sdk.python.entities.generate_request(data=data, **kwargs)
        request.method = 'POST'
        request.resource = '/agent_token_usage/'
        response = request.send()
        sdk.python.entities.check_response(response, 201)
        return response.json()


agent_token_usage = AgentTokenUsages()
