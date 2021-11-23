import datetime
import sdk.python.entities
import sdk.python.users
from sdk.python.automatic_payment_relationships import \
    AutomaticPaymentRelationship
from sdk.python.util.business_default import PAYMENT_TYPES
from sdk.python.entities import Property


class Payment(sdk.python.entities.Entity):

    resource = '/payments/'
    json_name = 'payment'

    def __init__(self):
        super(Payment, self).__init__()
        self.escape_fields = ['payment_type', 'pay_date']

    id = Property(int)
    note = Property(str)
    payment_type = Property(int)
    pay_date = Property(datetime.datetime)
    amount = Property(float)
    payment_recorder = Property(sdk.python.users.Users)
    send_sms = Property(bool)
    send_email = Property(bool)
    charged_by_payment_relationship = Property(AutomaticPaymentRelationship)

    def payment_type_string(self):
        """ Return the string value of payment type from the
            sdk.python.util.business_default file
        """
        return PAYMENT_TYPES[self.payment_type]


class Payments(sdk.python.entities.Resource):

    entity_class = Payment
    json_name = 'payments'


payments = Payments()
