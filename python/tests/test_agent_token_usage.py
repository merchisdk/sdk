from sdk.python.agent_token_usage import AgentTokenUsage, AgentTokenUsages, agent_token_usage
from sdk.python.companies import Company
from sdk.python.domains import Domain
from sdk.python.entities import Entity


class _FakeResponse:
    def __init__(self, status_code=200, payload=None):
        self.status_code = status_code
        self._payload = payload or {}

    def json(self):
        return self._payload


class _FakeRequest:
    last = None
    next_status = 200
    next_payload = {}

    def __init__(self):
        self.method = "GET"
        self.resource = "/"
        self.query = {}
        self.data = None
        self.files = None
        _FakeRequest.last = self

    def wraps_request(
        self,
        data=None,
        files=None,
        email=None,
        password=None,
        api_secret=None,
        query=None,
        embed=None,
        as_domain=None,
        include_archived=None,
        skip_rights=None,
    ):
        _ = (email, password, api_secret, embed, as_domain, include_archived)
        self.data = data
        self.files = files
        self.query = query or {}
        if skip_rights:
            self.query["skip_rights"] = skip_rights

    def send(self):
        return _FakeResponse(_FakeRequest.next_status, _FakeRequest.next_payload)


def _setup_fake_request():
    old = Entity.request_class
    Entity.request_class = _FakeRequest
    return old


def _restore_request(old):
    Entity.request_class = old


def test_agent_token_usage_record_posts_payload():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 201
        _FakeRequest.next_payload = {
            "agentTokenUsage": {
                "id": 1,
                "companyId": 2,
                "domainId": 3,
                "totalTokens": 150,
            }
        }
        resource = AgentTokenUsages()
        result = resource.record(
            {
                "domain_id": 3,
                "prompt_tokens": 120,
                "completion_tokens": 30,
                "source_type": "agent",
            }
        )
        assert result["agentTokenUsage"]["totalTokens"] == 150
        assert _FakeRequest.last.resource == "/agent_token_usage/"
        assert _FakeRequest.last.method == "POST"
        assert _FakeRequest.last.data["prompt_tokens"] == 120
    finally:
        _restore_request(old)


def test_company_get_agent_token_analytics():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {
            "dates": ["2026-06-01"],
            "totalTokens": [42],
            "promptTokens": [30],
            "completionTokens": [12],
        }
        company = Company()
        company.id = 7
        result = company.get_agent_token_analytics(query={"aggregate": "day"})
        assert result["totalTokens"] == [42]
        assert _FakeRequest.last.resource == "/companies/7/agent_token_analytics/"
        assert _FakeRequest.last.query["aggregate"] == "day"
    finally:
        _restore_request(old)


def test_domain_get_analytics_includes_agent_token_usage():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {
            "agentTokenUsage": {
                "percentageDifference": 0,
                "totals": 150,
                "previousTotals": 0,
            }
        }
        domain = Domain()
        domain.id = 4
        result = domain.get_analytics()
        assert result["agentTokenUsage"]["totals"] == 150
        assert _FakeRequest.last.resource == "/domains/4/analytics/"
        assert _FakeRequest.last.query.get("skip_rights") is True
    finally:
        _restore_request(old)
