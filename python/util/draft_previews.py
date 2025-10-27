import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.files import File
from sdk.python.products import Product
from sdk.python.draft_templates import DraftTemplate


class DraftPreview(sdk.python.entities.Entity):

    resource = '/draft_previews/'
    json_name = 'draft_preview'

    id = Property(int)
    file = Property(File)
    product = Property(Product)
    description = Property(str)
    name = Property(str)
    date = Property(datetime.datetime)
    height = Property(int)
    width = Property(int)
    draft_templates = Property(DraftTemplate)


class DraftPreviews(sdk.python.entities.Resource):

    entity_class = DraftPreview
    json_name = 'draft_previews'


draft_previews = DraftPreviews()
