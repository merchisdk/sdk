import { generateUUID } from './uuid.js';
import { addPropertyTo } from './model.js';
import { Assignment } from './assignment.js';
import { Job } from './job.js';

export function ShipmentItemFulfillment() {
    this.resource = '/shipment_item_fulfillments';
    this.json = 'shipmentItemFulfillment';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'assignment', Assignment);
    addPropertyTo(this, 'job', Job);
}
