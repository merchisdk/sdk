import generateUUID from './uuid.js';
import { addPropertyTo } from './model.js';


export function DiscountGroup() {
    this.resource = '/discountGroups';
    this.json = 'discountGroup';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'discountType');
    addPropertyTo(this, 'discounts');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'product');
}
