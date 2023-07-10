import generateUUID from './uuid.js';
import { addPropertyTo, serialise, fromJson, create, enumerateFiles,
    getOne, patchOne, deleteOne, getList, fromJsonList } from './model.js';
import { Domain } from './domain.js';
import { User } from './user.js';

export function EnrolledDomain() {
    this.resource = '/enrolled_domains';
    this.json = 'enrolledDomain';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'role');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'isJobsAssignee');


    this.create = function (success, error, embed, as_domain) {
        var self = this,
            data = serialise(self);
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: as_domain,
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed});
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

    this.patch = function (success, error, embed, asDomain) {
        var self = this,
            data = serialise(self, undefined, undefined, undefined,
                             {excludeOld: true})[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  as_domain: asDomain,
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };
}

export function EnrolledDomains() {
    this.resource = '/enrolled_domains';
    this.json = 'enrolledDomains';
    this.single = EnrolledDomain;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
