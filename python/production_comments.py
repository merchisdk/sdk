import datetime
import sdk.python.entities
from sdk.python.files import File
from sdk.python.entities import Property


class ProductionComment(sdk.python.entities.Entity):

    resource = '/production_comments/'
    json_name = 'production_comment'

    id = Property(int)
    files = Property(File)
    date = Property(datetime.datetime)
    text = Property(str)
    urgency = Property(int)
    subject = Property(str)
    is_urgent_question = Property(bool)
    send_sms = Property(bool)
    send_email = Property(bool)


class ProductionComments(sdk.python.entities.Resource):

    entity_class = ProductionComment
    json_name = 'productionComments'


production_comments = ProductionComments()
