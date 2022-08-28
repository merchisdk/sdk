import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { ShipmentMethod } from './shipment_method';

export function CartShipmentQuote() {
    this.resource = '/cart_shipment_quotes';
    this.json = 'cartShipmentQuote';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'subtotalCost');
    addPropertyTo(this, 'taxAmount');
    addPropertyTo(this, 'totalCost');
    addPropertyTo(this, 'shipmentMethod', ShipmentMethod);

    this.name = function () {
        const shipmentMethod = this.shipmentMethod();
        return shipmentMethod ? shipmentMethod.name() : null;
    }
}
