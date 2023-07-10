import generateUUID from './uuid.js';
import { addPropertyTo } from './model.js';

export function Discount() {
    this.resource = '/discounts';
    this.json = 'discount';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'lowerLimit');
    addPropertyTo(this, 'amount');

    this.discountedUnitCost = function (unitPrice) {
        var unitCost = unitPrice ? unitPrice : 0,
            amount = this.amount() ? this.amount() : 0,
            discount = 100 - amount;
        return parseFloat((unitCost / 100) * discount).toFixed(3);
    };
}
