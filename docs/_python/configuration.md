---
title: Configuration
position: 3
parameters:
  - name:
    content:
content_markdown: |-
    The python SDK requires some configuration before use.

    The request class must be subclassed. In the subclass, set up the `server` and `host` values. You can optionally also provide a `session_token` cookie, if the request should be authenticated as a specific user. The entity class's request class must then be set to the new subclass. The following example demonstrates: 
left_code_blocks:
  - code_block: |-
      import sdk.python.request
      import sdk.python.entities


      class ApiRequest(sdk.python.request.Request):
          def __init__(self, forbid_auto_update=False):
              super(ApiRequest, self).__init__()
              self.server = "https://api.merchi.co/"
              self.host = "api.merchi.co"
              self.cookies['session_token'] = flask.request.cookies.get('session_token')

      sdk.python.entities.Entity.request_class = ApiRequest
    title: configuration
    language: python
---
