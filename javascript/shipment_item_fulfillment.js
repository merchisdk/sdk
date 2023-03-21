import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { Assignment } from './assignment';
import { Job } from './job';

export function ShipmentItemFulfillment() {
    this.resource = '/shipment_item_fulfillments';
    this.json = 'shipmentItemFulfillment';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'assignment', Assignment);
    addPropertyTo(this, 'job', Job);
}
