class ApiError(Exception):

    def __init__(self, message, status_code, error_code, debug_message=None):
        Exception.__init__(self, message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.debug_message = debug_message

    def to_dict(self):
        return {'message': self.message,
                'status_code': self.status_code,
                'error_code': self.error_code}
