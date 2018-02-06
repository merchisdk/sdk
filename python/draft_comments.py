import datetime
import sdk.python.entities
import sdk.python.drafts
import sdk.python.users
from sdk.python.files import File
import sdk.python.notifications


class DraftComment(sdk.python.entities.Entity):

    resource = '/draft_comments/'
    json_name = 'draft_comment'

    def __init__(self):
        super(DraftComment, self).__init__()

        self.json_property(int, 'id')
        self.recursive_json_property(sdk.python.drafts.Draft,
                                     'draft')
        self.recursive_json_property(sdk.python.jobs.Job,
                                     'job')
        self.recursive_json_property(sdk.python.users.User, 'user')
        self.recursive_json_property(File, 'file')
        self.recursive_json_property(sdk.python.users.User, 'forwards')
        self.recursive_json_property(sdk.python.notifications.Notification,
                                     'notifications')
        self.json_property(int, 'urgency')
        self.json_property(str, 'subject')
        self.json_property(datetime.datetime, 'date')
        self.json_property(str, 'text')
        self.json_property(bool, 'change_request')
        self.json_property(bool, 'send_sms')
        self.json_property(bool, 'send_email')


class DraftComments(sdk.python.entities.Resource):

    entity_class = DraftComment
    json_name = 'draft_comments'


draft_comments = DraftComments()
