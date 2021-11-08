import { Company } from './company';
import { generateUUID } from './uuid';
import {
    addPropertyTo, serialise, fromJson, create, enumerateFiles,
    deleteOne, getList, fromJsonList, getOne } from './model';

export function AutomaticPaymentRelationship() {
    this.resource = '/automatic_payment_relationships';
    this.json = 'automaticPaymentRelationship';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'archived');
    addPropertyTo(this, 'id');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'stripeCustomerId');
    addPropertyTo(this, 'companyCustomer', Company);
    addPropertyTo(this, 'companySupplier', Company);

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

export function AutomaticPaymentRelationships() {
    this.resource = '/automatic_payment_relationships';
    this.json = 'automaticPaymentRelationships';
    this.single = AutomaticPaymentRelationship;

    this.get = function (success, error, offset, limit, q) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                {offset: offset, limit: limit, q: q});
    };
}
