import sdk.python.entities
import sdk.python.country_taxes
from sdk.python.entities import Property


class Item(sdk.python.entities.Entity):

    resource = '/items/'
    json_name = 'item'

    def __init__(self):
        super(Item, self).__init__()
        self.escape_fields = ['tax_type']

    description = Property(str)
    cost = Property(float)
    tax_amount = Property(float)
    quantity = Property(float)
    id = Property(int)

    tax_type = Property(sdk.python.country_taxes.CountryTax)

    def item_total(self):
        """ Return the total value of the item
            by multiplying the quantity by the cost. This value
            is without GST.
        """
        return self.cost * self.quantity

    def item_tax(self):
        """ Return the total tax based on the the quantity.  """
        return self.tax_amount * self.quantity


class Items(sdk.python.entities.Resource):

    entity_class = Item
    json_name = 'items'


items = Items()
