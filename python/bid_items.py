import sdk.python.entities
from common.item_types import item_type


class BidItem(sdk.python.entities.Entity):

    resource = '/bid_items'
    json_name = 'bid_item'

    def __init__(self):
        super(BidItem, self).__init__()

        self.json_property(int, 'id')
        self.json_property(int, 'type')
        self.json_property(int, 'quantity')
        self.json_property(str, 'description')
        self.json_property(float, 'unit_price')  # unit cents in db

    def item_total(self):
        """ Calculate the total of the item by
            multiplying the unit_price and quantity. It then
            returns the total
        """
        return self.quantity * self.unit_price

    def item_type_name(self):
        """ Return name of the bid_item type instead of type id """
        return item_type[self.type]


class BidItems(sdk.python.entities.Resource):

    entity_class = BidItem
    json_name = 'bidItem'


bid_items = BidItems()
