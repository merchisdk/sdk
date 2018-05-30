import sdk.python.util.errors


class ApiError(Exception):

    def __init__(self, message, status_code=400, error_code=None,
                 debug_message=None):
        Exception.__init__(self, message)
        self.message = message
        self.status_code = status_code
        self.debug_message = debug_message
        if error_code is None:
            if status_code > 499:
                error_code = sdk.python.util.errors.SERVER_ERROR
            elif status_code > 399:
                error_code = sdk.python.util.errors.CLIENT_ERROR
            else:
                error_code = sdk.python.util.errors.UNKNOWN_ERROR
        self.error_code = error_code

    def to_dict(self):
        return {'message': self.message,
                'status_code': self.status_code,
                'error_code': self.error_code}
