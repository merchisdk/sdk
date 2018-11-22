import sdk.python.entities
from sdk.python.domains import Domain
from sdk.python.entities import Property


class DomainTag(sdk.python.entities.Entity):

    json_name = 'domainTag'
    resource = '/domains_tags/'

    id = Property(int)
    name = Property(str)
    # colour is in RRGGBB format.
    colour = Property(int)
    description = Property(str)

    domain = Property(Domain, backref="tags")


class DomainTags(sdk.python.entities.Resource):

    entity_class = DomainTag
    json_name = 'domainTags'


domain_tags = DomainTags()
