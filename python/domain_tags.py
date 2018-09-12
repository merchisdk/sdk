import sdk.python.entities
from sdk.python.domains import Domain


class DomainTag(sdk.python.entities.Entity):

    json_name = 'domainTag'
    resource = '/domains_tags/'

    def __init__(self):
        super(DomainTag, self).__init__()
        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.recursive_json_property(Domain, 'domain')


class DomainTags(sdk.python.entities.Resource):

    entity_class = DomainTag
    json_name = 'domainTags'


domain_tags = DomainTags()
