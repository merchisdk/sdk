import { generateUUID } from './uuid.js';
import { addPropertyTo, getOne, fromJson, enumerateFiles, serialise, patchOne,
    deleteOne, fromJsonList, getList, create } from './model.js';
import { removeObjectFromArrayWithIntegerValue } from './helpers.js';
import { Address } from './address.js';
import { Assignment } from './assignment.js';
import { CountryTax } from './country_tax.js';
import { DomainTag } from './domain_tag.js';
import { User } from './user.js';
import { Company } from './company.js';
import { Invoice } from './invoice.js';
import { Job } from './job.js';
import { MerchiFile } from './merchi_file.js';
import { ShipmentItem } from './shipment_item.js';
import { ShipmentMethod } from './shipment_method.js';

export function Shipment() {
    this.resource = '/shipments';
    this.json = 'shipment';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'shipmentServiceBookingInfo');
    addPropertyTo(this, 'shipmentServiceQuote');
    addPropertyTo(this, 'shipmentLabel', MerchiFile);
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'dispatchDate');
    addPropertyTo(this, 'dispatchedDate');
    addPropertyTo(this, 'expectedReceiveDate');
    addPropertyTo(this, 'receivedDate');
    addPropertyTo(this, 'sender', User);
    addPropertyTo(this, 'senderCompany', Company);
    addPropertyTo(this, 'senderAddress', Address);
    addPropertyTo(this, 'senderNotes');
    addPropertyTo(this, 'blindShipTo');
    addPropertyTo(this, 'receiver', User);
    addPropertyTo(this, 'receiverCompany', Company);
    addPropertyTo(this, 'receiverAddress', Address);
    addPropertyTo(this, 'receiverNotes');
    addPropertyTo(this, 'invoices', Invoice);
    addPropertyTo(this, 'jobs', Job);
    addPropertyTo(this, 'assignments', Assignment);
    addPropertyTo(this, 'trackingNumber');
    addPropertyTo(this, 'transportCompany');
    addPropertyTo(this, 'transportCompanyName');
    addPropertyTo(this, 'sendSms');
    addPropertyTo(this, 'sendEmail');
    addPropertyTo(this, 'cost');
    addPropertyTo(this, 'taxAmount');
    addPropertyTo(this, 'maxWeight');
    addPropertyTo(this, 'maxVolume');
    addPropertyTo(this, 'taxType', CountryTax);
    addPropertyTo(this, 'senderResponsible');
    addPropertyTo(this, 'tags', DomainTag);
    addPropertyTo(this, 'shipmentItems', ShipmentItem)
    addPropertyTo(this, 'shipmentMethod', ShipmentMethod);

    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error,
                embed: embed});
     };

    this.create = function (options) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            options.success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: options.error,
                embed: options.embed});
    };

   this.patch = function (success, error, data, embed) {
        var self = this;
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

    this.update = function (options) {
        var self = this;
        this.patch(options.success,
            options.error,
            serialise(self, undefined, undefined, undefined,
                      {excludeOld: true})[0],
            options.embed);
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };

    this.hasJobs = function () {
        return Boolean(this.jobs()) && this.jobs().length > 0;
    };

    this.hasJob = function (job) {
        var jobIndex = this.jobs().findIndex(function (shipmentJob) {
            return shipmentJob.id() === job.id();
        });
        return jobIndex >= 0;
    };

    this.hasAssignments = function () {
        return Boolean(this.assignments()) && this.assignments().length > 0;
    };

    this.hasAssignment = function (assignment) {
        var assignments = this.assignments(),
            assignmentIndex;
        if (Boolean(assignments)) {
            assignmentIndex = assignments.findIndex(
                function (shipmentAssignment) {
                    return shipmentAssignment.id() === assignment.id();
                });
            return assignmentIndex >= 0;
        }
        return false;
    };

    this.removeAssignment = function (assignmentId) {
        var self = this;
        if (Boolean(assignmentId) && assignmentId !== '') {
            removeObjectFromArrayWithIntegerValue(self.assignments(),
                                                  'id', assignmentId);
        }
    };

    this.removeJob = function (jobId) {
        var self = this;
        if (Boolean(jobId) && jobId !== '') {
            removeObjectFromArrayWithIntegerValue(self.jobs(), 'id', jobId);
        }
    };

    this.readyForDispatchedNotification = function () {
        var self = this;
        return Boolean(self.id() && self.trackingNumber() &&
            self.transportCompany() && self.dispatchedDate());
    };

    this.userIsResponsible = function (user) {
        var senderResponsible = this.senderResponsible(),
            shipmentUser = senderResponsible ?
                this.sender() : this.receiver();
        return shipmentUser && shipmentUser.id() === user.id();
    };

    this.responsibleCompany = function () {
        return this.senderResponsible() ?
            this.senderCompany() : this.receiverCompany();
    };
}

export function Shipments() {
    this.resource = '/shipments';
    this.json = 'shipments';
    this.single = Shipment;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                parameters);
    };
}
