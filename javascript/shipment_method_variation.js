import { generateUUID } from './uuid.js';
import { addPropertyTo, fromJsonList, getList } from './model.js';
import { CountryTax } from './country_tax.js';
import { ShipmentMethod } from './shipment_method.js';

export function ShipmentMethodVariation() {
    this.resource = '/shipment_method_variations';
    this.json = 'shipmentMethodVariation';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'destinationCountry');
    addPropertyTo(this, 'destinationState');
    addPropertyTo(this, 'cost');
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'maxWeight');
    addPropertyTo(this, 'shipmentMethod', ShipmentMethod);
    addPropertyTo(this, 'taxType', CountryTax);
}

export function ShipmentMethodVariations() {
    this.resource = '/shipment_method_variations';
    this.json = 'shipmentMethodVariations';
    this.single = ShipmentMethodVariation;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                parameters);
    };
}
