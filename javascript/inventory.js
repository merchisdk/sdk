import { generateUUID } from './uuid';
import { addPropertyTo, serialise, fromJson, create, getOne, deleteOne,
    patchOne, fromJsonList, getList, enumerateFiles } from './model';
import { Address } from './address';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { Product } from './product';

export function Inventory() {
    this.resource = '/inventories';
    this.json = 'inventory';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'notes');
    addPropertyTo(this, 'quantity');
    addPropertyTo(this, 'product', Product);
    addPropertyTo(this, 'address', Address);
    addPropertyTo(this, 'inventoryUnitVariations',
                  InventoryUnitVariation);

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

    this.patch = function (success, error, embed) {
        var self = this,
            data = serialise(this)[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };

    this.update = function (success, error, embed) {
        this.patch(success, error,
                   serialise(this, undefined, undefined, undefined,
                             {excludeOld: true})[0], embed);
    };


    this.isVariationFieldOptionSelected = function (option) {
        var selectedVariations = this.inventoryUnitVariations() ?
            this.inventoryUnitVariations() : [];
        for (var i = 0; i < selectedVariations.length; i++) {
            if (selectedVariations[i].optionId() === option.id()) {
                return true;
            }
        }
        return false;
    };

}

export function Inventories() {
    this.resource = '/inventories';
    this.json = 'inventories';
    this.single = Inventory;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
