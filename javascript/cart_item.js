import generateUUID from './uuid.js';
import { addPropertyTo, serialise, fromJson, create,
     enumerateFiles } from './model.js';
import { Cart } from './cart.js';
import { CountryTax } from './country_tax.js';
import { Product } from './product.js';
import { Variation } from './variation.js';
import { VariationsGroup } from './variations_group.js';

export function CartItem() {
    this.resource = '/cart_items';
    this.json = 'cartItem';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'cart', Cart);
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'quantity');
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'product', Product);
    addPropertyTo(this, 'variations', Variation);
    addPropertyTo(this, 'variationsGroups', VariationsGroup);
    addPropertyTo(this, 'taxType', CountryTax);
    addPropertyTo(this, 'subtotalCost');
    addPropertyTo(this, 'totalCost');

    this.hasVariationsGroups = function () {
        var groups = this.variationsGroups();
        return groups && groups.length > 0;
    };

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

    this.calculate = function (success, error, embed) {
        var request = new Request(),
            data = serialise(this)[0];
        request.resource('/cart-item-cost-estimate/');
        request.method('POST');
        request.query().add('skip_rights', true);
        request.data().merge(data);
        function handleResponse(status, data) {
            if (status === 201) {
                success(fromJson(new CartItem(), data));
            } else {
                error(data);
            }
        }
        request.responseHandler(handleResponse).errorHandler(error);
        request.send();
    };

    this.requiresShipment = function() {
        var product = this.product();
        return product ? product.needsShipping() : false;
    };

}
