import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { ShipmentMethod } from './shipment_method';

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
