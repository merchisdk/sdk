import sdk.python.entities
from sdk.python.domains import Domain
from sdk.python.entities import Property


class DomainTag(sdk.python.entities.Entity):

    json_name = 'domainTag'
    resource = '/domains_tags/'

    id = Property(int)
    name = Property(str)
    domain = Property(Domain)


class DomainTags(sdk.python.entities.Resource):

    entity_class = DomainTag
    json_name = 'domainTags'


domain_tags = DomainTags()
