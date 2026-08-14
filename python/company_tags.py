import sdk.python.entities
from sdk.python.entities import Property


class CompanyTag(sdk.python.entities.Entity):

    json_name = 'companyTag'
    resource = '/company_tags/'

    id = Property(int)
    name = Property(str)
    # colour is in RRGGBB format.
    colour = Property(int)
    description = Property(str)
    show_public = Property(bool)

    company = Property('sdk.python.companies.Company', backref="tags")


class CompanyTags(sdk.python.entities.Resource):

    entity_class = CompanyTag
    json_name = 'companyTags'


company_tags = CompanyTags()
