import { generateUUID } from './uuid';
import { addPropertyTo } from './model';


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
