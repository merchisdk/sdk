import sdk.python.entities
from sdk.python.files import File
from sdk.python.entities import Property

class ProductComment(sdk.python.entities.Entity):

    resource = '/product_comments/'
    json_name = 'productComment'

    id = Property(int)
    file = Property(File)
    date = Property(datetime.datetime)
    text = Property(str)
    urgency = Property(int)
    subject = Property(str)
    is_urgent_question = Property(bool)
    send_sms = Property(bool)
    send_email = Property(bool)

class ProductComments(sdk.python.entities.Resource):

    entity_class = ProductComment
    json_name = 'productComments'

product_comments = ProductComments()
