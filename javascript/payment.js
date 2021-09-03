import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { paymentTypes } from './payment_types';
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
    addPropertyTo(this, 'paymentRecorder', User);

    this.paymentTypeText = function () {
        var paymentType = this.paymentType();
        return paymentType ? paymentTypes.get(paymentType) : 'Unknown';
    }
}