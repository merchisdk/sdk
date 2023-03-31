import { generateUUID } from './uuid.js';
import { addPropertyTo, fromJson, getOne, getList, serialise, create,
    fromJsonList, enumerateFiles } from './model.js';
import { Product } from './product.js';
import { Domain } from './domain.js';

export function SupplyDomain() {
    this.resource = '/supply_domains';
    this.json = 'supplyDomain';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'needsDrafting');
    addPropertyTo(this, 'product', Product);
    addPropertyTo(this, 'supplyProduct', Product);
    addPropertyTo(this, 'domain', Domain);

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

    this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
          success(fromJson(self, result[self.json]));
        }

        create({resource: this.resource,
                parameters: data[0],
                as_domain: as_domain,
                files: enumerateFiles(data[1]),
                success: handleResponse,
                data: error,
                embed: embed});
    };
}

export function SupplyDomains() {
    this.resource = '/supply_domains';
    this.json = 'supplyDomain';
    this.single = SupplyDomain;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
          success(fromJsonList(self, result,
                               {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
