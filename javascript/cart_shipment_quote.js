import { generateUUID } from './uuid.js';
import { addPropertyTo } from './model.js';
import { ShipmentMethod } from './shipment_method.js';

export function CartShipmentQuote() {
    this.resource = '/cart_shipment_quotes';
    this.json = 'cartShipmentQuote';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'subtotalCost');
    addPropertyTo(this, 'taxAmount');
    addPropertyTo(this, 'totalCost');
    addPropertyTo(this, 'shipmentMethod', ShipmentMethod);
    addPropertyTo(this, 'shipmentServiceQuote')
    addPropertyTo(this, 'shipmentService')

    this.name = function () {
        const shipmentMethod = this.shipmentMethod();
        return shipmentMethod ? shipmentMethod.name() : null;
    }
}
