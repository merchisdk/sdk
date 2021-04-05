import sdk.python.entities
from sdk.python.entities import Property


class DiscountGroup(sdk.python.entities.Entity):

    resource = '/discount_group/'
    json_name = 'discountGroup'

    id = Property(int)
    discount_type = Property(int)
    discounts = Property("Discount")
    product = Property("Product")


class DiscountGroups(sdk.python.entities.Resource):

    entity_class = DiscountGroup
    json_name = 'discountGroups'


discountGroups = DiscountGroups()
