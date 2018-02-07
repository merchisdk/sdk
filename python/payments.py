import datetime
import sdk.python.entities
import sdk.python.invoices
import sdk.python.users
from sdk.python.util.business_default import PAYMENT_TYPES


class Payment(sdk.python.entities.Entity):

    resource = '/payments/'
    json_name = 'payment'

    def __init__(self):
        super(Payment, self).__init__()
        self.escape_fields = ['payment_type', 'pay_date']
        self.json_property(int, 'id')
        self.json_property(str, 'note')
        self.json_property(int, 'payment_type')
        self.json_property(datetime.datetime, 'pay_date')
        self.json_property(float, 'amount')
        self.recursive_json_property(sdk.python.invoices.Invoice,
                                     'invoice')
        self.recursive_json_property(sdk.python.users.Users,
                                     'payment_recorder')
        self.json_property(bool, 'send_sms')
        self.json_property(bool, 'send_email')

    def payment_type_string(self):
        """ Return the string value of payment type from the
            sdk.python.util.business_default file
        """
        return PAYMENT_TYPES[self.payment_type]


class Payments(sdk.python.entities.Resource):

    entity_class = Payment
    json_name = 'payments'


payments = Payments()
