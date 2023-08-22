import generateUUID from './uuid.js';
import { addPropertyTo } from './model.js';
import { Company } from './company.js';

export function PaymentDevice() {
    this.resource = '/payment_devices';
    this.json = 'paymentDevices';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'code');
    addPropertyTo(this, 'deviceId');
    addPropertyTo(this, 'squareId');
    addPropertyTo(this, 'deviceData');
    addPropertyTo(this, 'company', Company);
    addPropertyTo(this, 'description');
}
