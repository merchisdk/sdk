import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { ShipmentItemFulfillment } from './shipment_item_fulfillment';
import { Job } from './job';

export function ShipmentItem() {
    this.resource = '/shipment_items';
    this.json = 'shipmentItem';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'fulfillments', ShipmentItemFulfillment);
}
