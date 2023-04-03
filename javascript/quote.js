import { generateUUID } from './uuid.js';
import { addPropertyTo, fromJson, getOne, fromJsonList,
    getList } from './model.js';
import { QuoteItem } from './quote_item.js';
import { Assignment } from './assignment.js';
import { Invoice } from './invoice.js';

export function Quote() {
    this.resource = '/quotes';
    this.json = 'quote';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'agreedDeadline');
    addPropertyTo(this, 'quoteItems', QuoteItem);
    addPropertyTo(this, 'assignments', Assignment);
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'invoice', Invoice);

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

    this.quoteTotal = function () {
        var self = this,
            items = Boolean(self.quoteItems()) ? self.quoteItems() : [],
            total = parseFloat(0.000), i;
        for (i = 0; i < items.length; i++) {
            total += parseFloat(items[i].total());
        }
        return total;
    };

    this.deadlineTimeDifference = function () {
        var self = this,
            proposedDeadline = Boolean(self.agreedDeadline()) ?
                self.agreedDeadline() : null,
            assignments = Boolean(self.assignments()) ?
                self.assignments() : null,
            assignment = Boolean(assignments) && assignments.length > 0 ?
                assignments[0] : null,
            productionDeadline = Boolean(assignment) ?
                assignment.productionDeadline() : null;
        if (Boolean(proposedDeadline) && Boolean(productionDeadline)) {
            return productionDeadline - proposedDeadline;
        }
        return null;
    };

    this.findQuoteItemIndex = function (quoteItemId) {
        var self = this,
            quoteItems = Boolean(self.quoteItems()) ? self.quoteItems() : [];
        return quoteItems.findIndex(function (arrayElement) {
                return String(arrayElement.id()) === String(quoteItemId);
            });
    };

    this.removeQuoteItem = function (quoteItem) {
        var self = this,
            itemIndex = self.findQuoteItemIndex(quoteItem.id()),
            quoteItems = self.quoteItems();
        if (Boolean(quoteItems) && itemIndex >= 0) {
            quoteItems.splice(itemIndex, 1);
        }
    };
}

export function Quotes() {
    this.resource = '/quotes';
    this.json = 'quotes';
    this.single = Quote;

    this.get = function (success, error, offset, limit, q) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                {offset: offset, limit: limit, q: q});
    };
}
