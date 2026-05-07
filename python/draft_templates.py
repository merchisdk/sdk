import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.files import File
from sdk.python.jobs import Job
from sdk.python.products import Product


class DraftTemplate(sdk.python.entities.Entity):

    resource = '/draft_templates/'
    json_name = 'draft_template'

    id = Property(int)
    file = Property(File)
    product = Property(Product)
    job = Property(Job)
    description = Property(str)
    name = Property(str)
    date = Property(datetime.datetime)
    height = Property(int)
    width = Property(int)
    customisation_map = Property(dict)
    customisation_map_source = Property(str)
    customisation_map_file_id = Property(str)


class DraftTemplates(sdk.python.entities.Resource):

    entity_class = DraftTemplate
    json_name = 'draft_templates'


draft_comments = DraftTemplates()
