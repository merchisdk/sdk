import sdk.python.entities
import sdk.python.products


class Discount(sdk.python.entities.Entity):

    resource = '/discount/'
    json_name = 'discount'

    def __init__(self):
        super(Discount, self).__init__()
        self.json_property(int, 'id')
        self.json_property(float, 'lower_limit')
        self.json_property(float, 'amount')
        self.recursive_json_property(sdk.python.products.Product, 'product')


class Discounts(sdk.python.entities.Resource):

    entity_class = Discount
    json_name = 'discounts'


discounts = Discounts()
