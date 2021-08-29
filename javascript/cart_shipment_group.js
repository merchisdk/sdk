import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { CartItem } from './cart_item';
import { CartShipmentQuote } from './cart_shipment_quote';

export function CartShipmentGroup() {
    this.resource = '/cart_shipment_groups';
    this.json = 'cartShipmentGroup';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'cartItems', CartItem);
    addPropertyTo(this, 'quotes', CartShipmentQuote);
    addPropertyTo(this, 'selectedQuote', CartShipmentQuote);

    this.selectedQuoteName = function () {
        var selectedQuote = this.selectedQuote();
        return selectedQuote ? selectedQuote.name() : null;
    }
}
