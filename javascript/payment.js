import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { paymentTypes } from './payment_types';
import { AutomaticPaymentRelationship } from './automatic_payment_relationship';
import { User } from './user';

export function Payment() {
    this.resource = '/payments';
    this.json = 'payments';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'note');
    addPropertyTo(this, 'paymentType');
    addPropertyTo(this, 'payDate');
    addPropertyTo(this, 'amount');
    addPropertyTo(this, 'sendSms');
    addPropertyTo(this, 'sendEmail');
    addPropertyTo(this, 'autoRefundable');
    addPropertyTo(this, 'refunded');
    addPropertyTo(this, 'refundIssuer', User);
    addPropertyTo(this, 'paymentRecorder', User);
    addPropertyTo(
      this,
      'chargedByPaymentRelationship',
      AutomaticPaymentRelationship);

    this.paymentTypeText = function () {
        var paymentType = this.paymentType();
        return paymentType ? paymentTypes.get(paymentType) : 'Unknown';
    }
}
