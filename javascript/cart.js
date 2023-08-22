import generateUUID from './uuid.js';
import { addPropertyTo, serialise, enumerateFiles, getOne, fromJson, patchOne,
   create, Request } from './model.js';
import { Address } from './address.js';
import { CartItem } from './cart_item.js';
import { CartShipmentGroup } from './cart_shipment_group.js';
import { Company } from './company.js';
import { Domain } from './domain.js';
import { Invoice } from './invoice.js';
import { Shipment } from './shipment.js';
import { User } from './user.js';


export function Cart() {
    this.resource = '/carts';
    this.json = 'cart';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'token');
    addPropertyTo(this, 'ip');
    addPropertyTo(this, 'client', User);
    addPropertyTo(this, 'clientCompany', Company);
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'subtotalCost');
    addPropertyTo(this, 'taxAmount');
    addPropertyTo(this, 'totalCost');
    addPropertyTo(this, 'cartItems', CartItem);
    addPropertyTo(this, 'cartItemsSubtotalCost');
    addPropertyTo(this, 'cartItemsTaxAmount');
    addPropertyTo(this, 'cartItemsTotalCost');
    addPropertyTo(this, 'shipmentSubtotalCost');
    addPropertyTo(this, 'shipmentTaxAmount');
    addPropertyTo(this, 'shipmentTotalCost');
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'receiverNotes');
    addPropertyTo(this, 'shipmentGroups', CartShipmentGroup);
    addPropertyTo(this, 'invoice', Invoice);
    addPropertyTo(this, 'shipment', Shipment);
    addPropertyTo(this, 'receiverAddress', Address);

    this.create = function (success, error, embed, asDomain) {
        var self = this,
            data = serialise(self);
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: asDomain,
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed});
    };

    this.get = function (success, error, embed, includeArchived,
                         withRights) {
        var self = this,
            parameters = {
                cartToken: this.token(),
                embed: embed,
                error: error,
                id: this.id(),
                includeArchived: includeArchived,
                withRights: withRights,
                resource: this.resource};
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        parameters.success = handleResponse;
        getOne(parameters);
    };

    this.patch = function (success, error, embed) {
        var self = this,
            data = serialise(this, undefined, undefined, undefined,
                             {excludeOld: true})[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({cartToken: this.token(),
                  resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };

    this.getShipmentGroupsAndQuotes = function (success, error) {
        var self = this,
            request = new Request();
        request.resource(`/generate-cart-shipment-quotes/${self.id()}/`);
        request.method('GET');
        request.query().add('cart_token', this.token());
        function handleResponse(status, data) {
            if (status === 200) {
                success(fromJson(self, data, {makesDirty: false}));
            } else {
                error(status, data);
            }
        }
        request.responseHandler(handleResponse).errorHandler(error);
        request.send();
    };

    this.requiresShipment = function () {
        var cartItems = this.cartItems() ? this.cartItems() : [],
            i;
        for (i = 0; i < cartItems.length; i++) {
            if (cartItems[i].requiresShipment()) {
                return true;
            }
        }
    };

    this.stripePublishableKey = function () {
        return this.domain().company() ?
            this.domain().company().stripePublishableKey() : null;
    };

    this.stripeIsValidAndActive = function () {
        const company = this.domain().company();
        return this.stripePublishableKey() && company &&
            company.acceptStripe();
    };
}
