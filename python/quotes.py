import datetime
import sdk.python.entities
from sdk.python.quote_items import QuoteItem
from sdk.python.shipments import Shipment
from sdk.python.invoices import Invoice
from functools import reduce
from sdk.python.entities import Property


# quoting
def addup_subtotal(prev_total, b):
    """ Return the value of object.quantity * object.unit_price """
    return prev_total + (b.quantity * b.unit_price)


class Quote(sdk.python.entities.Entity):

    resource = '/quotes/'
    json_name = 'quote'

    id = Property(int)
    agreed_deadline = Property(datetime.datetime)
    currency = Property(str)
    quote_items = Property(QuoteItem)
    shipments = Property(Shipment)
    invoice = Property(Invoice)

    def quote_total(self):
        """ Calculate the quote sub total by adding all
            the quote_item totals together.
        """
        return round(reduce(addup_subtotal, self.quote_items, 0), 2)


class Quotes(sdk.python.entities.Resource):

    entity_class = Quote
    json_name = 'quotes'


quotes = Quotes()
