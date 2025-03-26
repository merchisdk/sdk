import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.files import File
from sdk.python.jobs import Job
from sdk.python.products import Product
from sdk.python.variations import VariationField, VariationFieldOption


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
    edited_by_variation_fields = Property(VariationField)
    selected_by_variation_field_options = Property(VariationFieldOption)
    original = Property('sdk.python.draft_templates.DraftTemplate')


class DraftTemplates(sdk.python.entities.Resource):

    entity_class = DraftTemplate
    json_name = 'draft_templates'


draft_comments = DraftTemplates()
