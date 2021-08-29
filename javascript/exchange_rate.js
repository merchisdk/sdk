import { generateUUID } from './uuid';
import { addPropertyTo, serialise, fromJson, create, enumerateFiles, deleteOne,
    getOne, fromJsonList, getList } from './model';


export function ExchangeRate() {
    this.resource = '/exchange_rates';
    this.json = 'exchangeRate';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'fromCurrency');
    addPropertyTo(this, 'toCurrency');
    addPropertyTo(this, 'rate');
    addPropertyTo(this, 'lastUpdated');

    this.create = function (success, error, embed, domainId) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed,
                as_domain: domainId});
    };

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

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };
}

export function ExchangeRates() {
    this.resource = '/exchange_rates';
    this.json = 'exchangeRates';
    this.single = ExchangeRate;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
