import { generateUUID } from './uuid';
import { addPropertyTo, create, serialise, fromJson, enumerateFiles, patchOne,
    fromJsonList, getList } from './model';
import { Address } from './address';
import { CountryTax } from './country_tax';
import { Company } from './company';
import { ShipmentMethodVariation } from './shipment_method_variation';

export function ShipmentMethod() {
    this.resource = '/shipment_methods';
    this.json = 'shipmentMethod';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'shipmentService');
    addPropertyTo(this, 'originAddress', Address);
    addPropertyTo(this, 'company', Company);
    addPropertyTo(this, 'companyDefault');
    addPropertyTo(this, 'defaultCost');
    addPropertyTo(this, 'maxCost');
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'transportCompany');
    addPropertyTo(this, 'transportCompanyName');
    addPropertyTo(this, 'variations', ShipmentMethodVariation);
    addPropertyTo(this, 'taxType', CountryTax);

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
    this.patch = function (success, error, embed) {
        var self = this,
            data = serialise(this, undefined, undefined, undefined,
                             {excludeOld: true})[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };
}

export function ShipmentMethods() {
    this.resource = '/shipment_methods';
    this.json = 'shipmentMethods';
    this.single = ShipmentMethod;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                parameters);
    };
}
