import datetime
import sdk.python.entities
from sdk.python.entities import Property


class DiscountGroup(sdk.python.entities.Entity):

    resource = '/discount_group/'
    json_name = 'discountGroup'

    id = Property(int)
    created = Property(datetime.datetime)
    date_end = Property(datetime.datetime)
    date_start = Property(datetime.datetime)
    discount_type = Property(int)
    group_restricted = Property(bool)
    name = Property(str)
    discounts = Property("Discount")
    domain = Property("Domain")
    product = Property("Product")


class DiscountGroups(sdk.python.entities.Resource):

    entity_class = DiscountGroup
    json_name = 'discountGroups'


discountGroups = DiscountGroups()
