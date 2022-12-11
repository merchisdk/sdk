import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { Assignment } from './assignment';
import { Job } from './job';

export function ShipmentItem() {
    this.resource = '/shipment_items';
    this.json = 'shipmentItem';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'fulfillments', Job || Assignment);
}
