import generateUUID from './uuid.js';
import { addPropertyTo } from './model.js';
import { ShipmentItemFulfillment } from './shipment_item_fulfillment.js';
import { Job } from './job.js';

export function ShipmentItem() {
    this.resource = '/shipment_items';
    this.json = 'shipmentItem';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'fulfillments', ShipmentItemFulfillment);
}
