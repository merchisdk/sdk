import { generateUUID } from './uuid.js';
import { addPropertyTo } from './model';
import { Address } from './address';
import { Companies } from './company';

export function Bank() {
    this.resource = '/banks';
    this.json = 'bank';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'bankName');
    addPropertyTo(this, 'accountNumber');
    addPropertyTo(this, 'accountName');
    addPropertyTo(this, 'bsb');
    addPropertyTo(this, 'swiftCode');
    addPropertyTo(this, 'iban');
    addPropertyTo(this, 'bankCode');
    addPropertyTo(this, 'bankAddress', Address);
    addPropertyTo(this, 'company', Companies);
}
