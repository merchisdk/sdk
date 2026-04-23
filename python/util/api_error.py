import json


class ApiError(Exception):

    def __init__(
        self,
        message,
        status_code,
        error_code,
        debug_message=None,
        details=None,
    ):
        Exception.__init__(self, message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.debug_message = debug_message
        # ``details`` is an optional JSON-serializable dict of structured
        # context about the error (e.g. the entity id that was missing
        # and the fields the client sent for it). It is surfaced in the
        # error response when non-None, alongside the existing
        # ``message``/``statusCode``/``errorCode`` keys. Existing
        # callers that do not pass ``details`` see no change in
        # behaviour or response shape.
        self.details = details

    def __repr__(self):
        return json.dumps(self.to_dict(), indent=4)

    def __str__(self):
        return self.__repr__()

    def to_dict(self):
        result = {'message': self.message,
                  'status_code': self.status_code,
                  'error_code': self.error_code}
        if self.details is not None:
            result['details'] = self.details
        return result
