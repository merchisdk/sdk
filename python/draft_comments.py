import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.files import File


class DraftComment(sdk.python.entities.Entity):

    resource = '/draft_comments/'
    json_name = 'draft_comment'

    id = Property(int)
    files = Property(File)
    urgency = Property(int)
    subject = Property(str)
    date = Property(datetime.datetime)
    text = Property(str)
    change_request = Property(bool)
    send_sms = Property(bool)
    send_email = Property(bool)


class DraftComments(sdk.python.entities.Resource):

    entity_class = DraftComment
    json_name = 'draft_comments'


draft_comments = DraftComments()
