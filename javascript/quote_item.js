import { generateUUID } from './uuid';
import { addPropertyTo, fromJson, getOne, fromJsonList,
    getList } from './model';

export function QuoteItem() {
    this.resource = '/quote_items';
    this.json = 'quoteItem';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'type');
    addPropertyTo(this, 'quantity');
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'unitPrice');

    this.get = function (success, error) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error});
    };

    this.total = function () {
        var self = this,
            quantity = Boolean(self.quantity()) ? self.quantity() : 0,
            unitPrice = Boolean(self.unitPrice()) ? self.unitPrice() : 0,
            total;
        total = quantity * unitPrice;
        return total.toFixed(3);
    };
}

export function QuoteItems() {
    this.resource = '/quote_items';
    this.json = 'quoteItems';
    this.single = QuoteItem;

    this.get = function (success, error, offset, limit, q) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                {offset: offset, limit: limit, q: q});
    };
}
