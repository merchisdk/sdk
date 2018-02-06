import datetime
import sdk.python.entities
from sdk.python.bid_items import BidItem
from functools import reduce


# bidding
def addup_subtotal(prev_total, b):
    """ Return the value of object.quantity * object.unit_price """
    return prev_total + (b.quantity * b.unit_price)


class Bid(sdk.python.entities.Entity):

    resource = '/bids/'
    json_name = 'bid'

    def __init__(self):
        super(Bid, self).__init__()

        self.json_property(int, 'id')
        self.json_property(datetime.datetime, 'agreed_deadline')
        self.recursive_json_property(sdk.python.jobs.Assignment,
                                     "assignments")
        self.recursive_json_property(BidItem, 'bid_items')

    def bid_total(self):
        """ Calculate the bid sub total by adding all
            the bid_item totals together.
        """
        return round(reduce(addup_subtotal, self.bid_items, 0), 2)


class Bids(sdk.python.entities.Resource):

    entity_class = Bid
    json_name = 'bids'


bids = Bids()
