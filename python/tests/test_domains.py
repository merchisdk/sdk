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


def test_domain_storefront_get_routes_and_skip_rights():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {"storefrontV2": {"status": "ready"}}
        domain = Domain()
        domain.id = 12

        result = domain.get_storefront_v2()

        assert result["storefrontV2"]["status"] == "ready"
        assert _FakeRequest.last.resource == "/domains/12/storefront_v2/"
        assert _FakeRequest.last.method == "GET"
        assert _FakeRequest.last.query.get("skip_rights") is True
    finally:
        _restore_request(old)


def test_domain_storefront_get_passes_active_preview_branch_attributes():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {
            "storefrontV2": {
                "status": "ready",
                "activePreviewBranchName": "storefront-v2/preview-12-20260521073000",
                "activePreviewStartedAt": "2026-05-21T07:30:00Z",
                "activePreviewLastRequestId": 123,
            }
        }
        domain = Domain()
        domain.id = 12

        result = domain.get_storefront_v2()

        storefront = result["storefrontV2"]
        assert storefront["activePreviewBranchName"] == "storefront-v2/preview-12-20260521073000"
        assert storefront["activePreviewStartedAt"] == "2026-05-21T07:30:00Z"
        assert storefront["activePreviewLastRequestId"] == 123
    finally:
        _restore_request(old)


def test_domain_storefront_post_routes_and_data_payload():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {"storefrontChangeRequest": {"id": 7}}
        domain = Domain()
        domain.id = 12

        result = domain.create_storefront_change_request({"prompt": "Update hero"})

        assert result["storefrontChangeRequest"]["id"] == 7
        assert _FakeRequest.last.resource == "/domains/12/storefront_v2/requests/"
        assert _FakeRequest.last.method == "POST"
        assert _FakeRequest.last.data == {"prompt": "Update hero"}
        assert _FakeRequest.last.query.get("skip_rights") is True
    finally:
        _restore_request(old)


def test_domain_storefront_post_supports_context_paths_and_images():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {"storefrontChangeRequest": {"id": 8}}
        domain = Domain()
        domain.id = 12
        payload = {
            "prompt": "Update hero",
            "contextFilePaths": ["src/app/page.tsx", "components/hero.tsx"],
            "contextImages": [
                {
                    "name": "hero-ref.png",
                    "mimeType": "image/png",
                    "dataUrl": "data:image/png;base64,abc123",
                }
            ],
        }

        result = domain.create_storefront_change_request(payload)

        assert result["storefrontChangeRequest"]["id"] == 8
        assert _FakeRequest.last.resource == "/domains/12/storefront_v2/requests/"
        assert _FakeRequest.last.method == "POST"
        assert _FakeRequest.last.data == payload
        assert _FakeRequest.last.query.get("skip_rights") is True
    finally:
        _restore_request(old)


def test_domain_storefront_provision_supports_url_structure_payload():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 201
        _FakeRequest.next_payload = {
            "storefrontV2": {
                "status": "ready",
                "urlStructure": "/products/:product",
            }
        }
        domain = Domain()
        domain.id = 12
        payload = {
            "starterTemplate": "merchisdk/nextjs-storefront-starter",
            "urlStructure": "/products/:product",
        }

        result = domain.provision_storefront_v2(payload)

        assert result["storefrontV2"]["urlStructure"] == "/products/:product"
        assert _FakeRequest.last.resource == "/domains/12/storefront_v2/provision/"
        assert _FakeRequest.last.method == "POST"
        assert _FakeRequest.last.data == payload
        assert _FakeRequest.last.query.get("skip_rights") is True
    finally:
        _restore_request(old)


def test_domain_storefront_can_extract_site_context():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {
            "siteContext": {
                "sourceUrl": "https://example.com",
                "analysisFilePath": "docs/site-analysis/example.com-analysis.md",
                "analysisJsonFilePath": "docs/site-analysis/example.com-analysis.json",
                "analysisScreenshotPaths": [
                    "docs/site-analysis/screenshots/example.com-landing-desktop.png"
                ],
                "analysisScreenshots": [
                    {
                        "name": "landing (desktop)",
                        "pageUrl": "https://example.com",
                        "path": "docs/site-analysis/screenshots/example.com-landing-desktop.png",
                    }
                ],
                "emulationSpec": {
                    "routeContract": {"recommendedUrlStructure": "/products/:product"}
                },
            }
        }
        domain = Domain()
        domain.id = 12
        payload = {"url": "https://example.com"}

        result = domain.extract_storefront_v2_site_context(payload)

        assert result["siteContext"]["sourceUrl"] == "https://example.com"
        assert result["siteContext"]["analysisFilePath"] == "docs/site-analysis/example.com-analysis.md"
        assert result["siteContext"]["analysisJsonFilePath"] == "docs/site-analysis/example.com-analysis.json"
        assert result["siteContext"]["analysisScreenshotPaths"] == [
            "docs/site-analysis/screenshots/example.com-landing-desktop.png"
        ]
        assert (
            result["siteContext"]["emulationSpec"]["routeContract"]["recommendedUrlStructure"]
            == "/products/:product"
        )
        assert _FakeRequest.last.resource == "/domains/12/storefront_v2/site_context/extract/"
        assert _FakeRequest.last.method == "POST"
        assert _FakeRequest.last.data == payload
        assert _FakeRequest.last.query.get("skip_rights") is True
    finally:
        _restore_request(old)


def test_domain_storefront_run_supports_checks_and_pr_fields():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {
            "storefrontChangeRequest": {
                "id": 11,
                "status": "running",
                "pullRequestNumber": 33,
                "checksSummary": {
                    "overall": "passing",
                    "counts": {"total": 3, "passed": 3, "failed": 0, "pending": 0},
                },
                "checksUpdatedAt": "2026-05-15T00:00:00Z",
            }
        }
        domain = Domain()
        domain.id = 12
        payload = {
            "status": "running",
            "pullRequestNumber": 33,
            "checksSummary": {"overall": "passing"},
            "checksUpdatedAt": "2026-05-15T00:00:00Z",
        }

        result = domain.run_storefront_change_request(11, payload)

        assert result["storefrontChangeRequest"]["pullRequestNumber"] == 33
        assert result["storefrontChangeRequest"]["checksSummary"]["overall"] == "passing"
        assert _FakeRequest.last.resource == "/storefront_change_requests/11/run/"
        assert _FakeRequest.last.method == "POST"
        assert _FakeRequest.last.data == payload
        assert _FakeRequest.last.query.get("skip_rights") is True
    finally:
        _restore_request(old)


def test_domain_storefront_change_request_events_routes_and_skip_rights():
    old = _setup_fake_request()
    try:
        _FakeRequest.next_status = 200
        _FakeRequest.next_payload = {
            "requestId": 11,
            "events": [
                {
                    "timestamp": "2026-05-21T08:30:00Z",
                    "stage": "generating_changes",
                    "level": "info",
                    "message": "Generating and applying code changes.",
                }
            ],
        }
        domain = Domain()
        domain.id = 12

        result = domain.get_storefront_change_request_events(11)

        assert result["requestId"] == 11
        assert result["events"][0]["stage"] == "generating_changes"
        assert _FakeRequest.last.resource == "/storefront_change_requests/11/events/"
        assert _FakeRequest.last.method == "GET"
        assert _FakeRequest.last.query.get("skip_rights") is True
    finally:
        _restore_request(old)
