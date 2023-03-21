import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.domains import Domain


class SeoDomainPage(sdk.python.entities.Entity):

    resource = '/seo_domain_page/'
    json_name = 'seoDomainPage'

    id = Property(int)
    archived = Property(datetime.datetime)
    domain = Property(Domain)
    meta_description = Property(str)
    meta_robots = Property(str)
    meta_title = Property(str)
    page_key = Property(str)


class SeoDomainPages(sdk.python.entities.Resource):

    entity_class = SeoDomainPage
    json_name = 'seoDomainPages'


seo_domain_pages = SeoDomainPages()
