import sdk.python.entities
import sdk.python.invoices
import sdk.python.country_taxes


class Item(sdk.python.entities.Entity):

    resource = '/items/'
    json_name = 'item'

    def __init__(self):
        super(Item, self).__init__()
        self.escape_fields = ['tax_type']
        self.json_property(str, 'description')
        self.json_property(float, 'cost')
        self.json_property(float, 'tax_amount')
        self.json_property(float, 'quantity')
        self.json_property(int, 'id')

        self.recursive_json_property(sdk.python.invoices.Invoice,
                                     'invoice')
        self.recursive_json_property(sdk.python.country_taxes.CountryTax,
                                     'tax_type')

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
