import datetime
import sdk.python.entities
from sdk.python.files import File
from sdk.python.entities import Property


class JobComment(sdk.python.entities.Entity):

    resource = '/job_comments/'
    json_name = 'job_comment'

    id = Property(int)
    file = Property(File)
    date = Property(datetime.datetime)
    text = Property(str)
    urgency = Property(int)
    subject = Property(str)
    send_sms = Property(bool)
    send_email = Property(bool)
    open_to_client = Property(bool)


class JobComments(sdk.python.entities.Resource):

    entity_class = JobComment
    json_name = 'jobComments'


job_comments = JobComments()
