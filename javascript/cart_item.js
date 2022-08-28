import { generateUUID } from './uuid';
import { addPropertyTo, serialise, fromJson, create,
     enumerateFiles } from './model';
import { Cart } from './cart';
import { CountryTax } from './country_tax';
import { Product } from './product';
import { Variation } from './variation';
import { VariationsGroup } from './variations_group';

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
        function handleResponse(status, body) {
            var result = '';
            if (status === 201) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server',
                              errorCode: 0};
                }
                success(fromJson(new CartItem(), result));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not get quote',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError(status, data) {
            var responseData = data ? JSON.parse(data) :
                {message: 'could not connect to server',
                  errorCode: 0}
             error(status, responseData);
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    };

    this.requiresShipment = function() {
        var product = this.product();
        return product ? product.needsShipping() : false;
    };

}
