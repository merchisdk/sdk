import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, fromJson, create, enumerateFiles,
    deleteOne, getList, fromJsonList, getOne } from './model.js';

export function CompanyInvitation() {
    this.resource = '/company_invitations';
    this.json = 'companyInvitation';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'userName');
    addPropertyTo(this, 'userEmail');
    addPropertyTo(this, 'token');
    addPropertyTo(this, 'inviteAsAdmin');

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

export function CompanyInvitations() {
    this.resource = '/company_invitations';
    this.json = 'companyInvitations';
    this.single = CompanyInvitation;

    this.get = function (success, error, offset, limit, q) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                {offset: offset, limit: limit, q: q});
    };
}

