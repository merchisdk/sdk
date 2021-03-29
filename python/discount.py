import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.discount_group import DiscountGroup


class Discount(sdk.python.entities.Entity):

    resource = '/discount/'
    json_name = 'discount'

    id = Property(int)
    lower_limit = Property(float)
    amount = Property(float)
    discount_group = Property(DiscountGroup)


class Discounts(sdk.python.entities.Resource):

    entity_class = Discount
    json_name = 'discounts'


discounts = Discounts()
