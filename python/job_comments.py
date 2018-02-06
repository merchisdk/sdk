import datetime
import sdk.python.entities
import sdk.python.users
from sdk.python.files import File
import sdk.python.jobs
import sdk.python.notifications


class JobComment(sdk.python.entities.Entity):

    resource = '/job_comments/'
    json_name = 'job_comment'

    def __init__(self):
        super(JobComment, self).__init__()

        self.json_property(int, 'id')
        self.recursive_json_property(sdk.python.jobs.Job, 'job')
        self.recursive_json_property(sdk.python.users.User, 'user')
        self.recursive_json_property(sdk.python.users.User, 'forwards')
        self.recursive_json_property(File, 'file')
        self.recursive_json_property(sdk.python.notifications.Notification,
                                     'notifications')
        self.json_property(datetime.datetime, 'date')
        self.json_property(str, 'text')
        self.json_property(int, 'urgency')
        self.json_property(str, 'subject')
        self.json_property(bool, 'send_sms')
        self.json_property(bool, 'send_email')


class JobComments(sdk.python.entities.Resource):

    entity_class = JobComment
    json_name = 'jobComments'


job_comments = JobComments()
