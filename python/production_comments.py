import datetime
import sdk.python.entities
import sdk.python.users
from sdk.python.files import File
import sdk.python.jobs
import sdk.python.notifications


class ProductionComment(sdk.python.entities.Entity):

    resource = '/production_comments/'
    json_name = 'production_comment'

    def __init__(self):
        super(ProductionComment, self).__init__()

        self.json_property(int, 'id')
        self.recursive_json_property(sdk.python.jobs.Assignment,
                                     'assignment')
        self.recursive_json_property(sdk.python.users.User, 'user')
        self.recursive_json_property(File, 'file')
        self.recursive_json_property(sdk.python.users.User,
                                     'forwards')
        self.recursive_json_property(sdk.python.notifications.Notification,
                                     'notifications')
        self.json_property(datetime.datetime, 'date')
        self.json_property(str, 'text')
        self.json_property(int, 'urgency')
        self.json_property(str, 'subject')
        self.json_property(bool, 'is_urgent_question')
        self.json_property(bool, 'send_sms')
        self.json_property(bool, 'send_email')


class ProductionComments(sdk.python.entities.Resource):

    entity_class = ProductionComment
    json_name = 'productionComments'


production_comments = ProductionComments()
