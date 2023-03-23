import { generateUUID } from './uuid.js';
import { addPropertyTo, fromJson, serialise, create, enumerateFiles,
    getOne, deleteOne, fromJsonList, getList } from './model.js';
import { Domain } from './domain.js';

export function Category() {
    this.resource = '/categories';
    this.json = 'category';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'showDashboard');
    addPropertyTo(this, 'showPublic');
    addPropertyTo(this, 'showPublicSupplierResell');
    addPropertyTo(this, 'domain', Domain);

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

export function Categories() {
    this.resource = '/categories';
    this.json = 'categories';
    this.single = Category;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
