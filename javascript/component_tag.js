import generateUUID from './uuid.js';
import { addPropertyTo, fromJson, getOne, serialise, create, enumerateFiles,
    fromJsonList, getList } from './model.js';

export function ComponentTag() {
    this.resource = '/component_tags';
    this.json = 'componentTag';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');

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
}

export     function ComponentTags() {
        this.resource = '/component_tags';
        this.json = 'componentTags';
        this.single = ComponentTag;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }
