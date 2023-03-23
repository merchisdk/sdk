import moment from 'moment-timezone';
import { generateUUID } from './uuid.js';
import { addPropertyTo, create, serialise, enumerateFiles, getOne, getList,
    fromJson, deleteOne, fromJsonList, patchOne, Request } from './model.js';
import { isUndefinedOrNull } from './helpers.js';
import { Address } from './address.js';
import { EmailAddress } from './email_address.js';
import { Domain } from './domain.js';
import { DomainTag } from './domain_tag.js';
import { Item } from './item.js';
import { Company } from './company.js';
import { PhoneNumber } from './phone_number.js';
import { User } from './user.js';
import { Shipment } from './shipment.js';
import { MerchiFile } from './merchi_file.js';
import { Quote } from './quote.js';
import { Payment } from './payment.js';
import { Job } from './job.js';

export function Invoice() {
    this.resource = '/invoices';
    this.json = 'invoice';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'note');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'paymentDeadline');
    addPropertyTo(this, 'sendSms');
    addPropertyTo(this, 'sendEmail');
    addPropertyTo(this, 'unpaid');
    addPropertyTo(this, 'totalCost');
    addPropertyTo(this, 'subtotalCost');
    addPropertyTo(this, 'taxAmount');
    addPropertyTo(this, 'invoiceToken');
    addPropertyTo(this, 'canAutoPay');
    addPropertyTo(this, 'responsibleManager', User);
    addPropertyTo(this, 'creator', User);
    addPropertyTo(this, 'client', User);
    addPropertyTo(this, 'clientEmail', EmailAddress);
    addPropertyTo(this, 'clientPhone', PhoneNumber);
    addPropertyTo(this, 'clientCompany', Company);
    addPropertyTo(this, 'clientCompanyEmail', EmailAddress);
    addPropertyTo(this, 'clientCompanyPhone', PhoneNumber);
    addPropertyTo(this, 'jobs', Job);
    addPropertyTo(this, 'quotes', Quote);
    addPropertyTo(this, 'items', Item);
    addPropertyTo(this, 'shipping', Address);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'pdf', MerchiFile);
    addPropertyTo(this, 'receipt', MerchiFile);
    addPropertyTo(this, 'payments', Payment);
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'acceptSquare');
    addPropertyTo(this, 'acceptStripe');
    addPropertyTo(this, 'acceptPaypal');
    addPropertyTo(this, 'acceptUtrust');
    addPropertyTo(this, 'acceptBankTransfer');
    addPropertyTo(this, 'acceptPhonePayment');
    addPropertyTo(this, 'tags', DomainTag);
    addPropertyTo(this, 'reminderMessage');
    addPropertyTo(this, 'reminded');
    addPropertyTo(this, 'isRemindable');
    addPropertyTo(this, 'forceReminders');
    addPropertyTo(this, 'owedMoney');
    addPropertyTo(this, 'paidMoney');
    addPropertyTo(this, 'isCompletelyPaid');
    addPropertyTo(this, 'shipments', Shipment);
    addPropertyTo(this, 'shopifyOrderId');

    this.create = function (success, error, embed, asDomain) {
        var data = serialise(this),
            self = this,
            domain = self.domain() ? self.domain().id() : null,
            domainId = isUndefinedOrNull(asDomain) ? domain : asDomain;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: domainId,
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed});
   };

   this.patch = function (success, error, embed, asDomain) {
        var self = this,
            data = serialise(this, undefined, undefined, undefined,
                             {excludeOld: true})[0],
            domain = self.domain() ? self.domain().id() : null,
            domainId = isUndefinedOrNull(asDomain) ? domain : asDomain;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  error: error,
                  as_domain: domainId,
                  data: data,
                  embed: embed});
    };

    this.publicCreate = function (success, error) {
        var data = serialise(this),
            self = this,
            result = '',
            request = new Request();
        request.data().merge(data[0]);
        request.resource('/public-invoice-create/');
        request.method('POST');
        function handleResponse(status, body) {
            var jsonBody;
            if (status === 201) {
                try {
                    jsonBody = JSON.parse(body);
                    result = fromJson(self, jsonBody[self.json]);
                    success(result);
                } catch (e) {
                    result = {message: 'invalid json from server'};
                    error(status, result);
                }
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Unable to create invoice.'};
                }
                error(status, result);
            }
        }
        function handleError(status, body) {
            try {
                result = JSON.parse(body);
            } catch (e) {
                result = {message: 'Invalid json from server',
                          errorCode: 0};
            }
            error(status, result);
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    };

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

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };

    this.company = function () {
        return this.domain() ? this.domain().company() : null;
    };

    this.paymentPhoneNumbers = function () {
        return this.company() ?
            this.company().paymentPhoneNumbers() : null;
    }

    this.paymentBanks = function () {
        return this.company() ? this.company().banks() : null;
    }

    this.stripePublishableKey = function () {
        return this.company() ?
          this.company().stripePublishableKey() : null;
    }

    this.calculate = function (success, error, embed) {
        var self = this,
            request = new Request(),
            data = serialise(this)[0];
        request.resource('/invoice-cost-estimate/');
        request.method('POST');
        request.query().add("as_domain", self.domain().id());
        request.query().add('skip_rights', true);
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 201) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server',
                              errorCode: 0};
                }
                success(fromJson(self, result));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not get quote',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    this.amountPaid = function () {
        var payments = this.payments() ? this.payments() : [],
            total = 0,
            i;
        for (i = 0; i < payments.length; i++) {
            var amount = payments[i].amount();
            total += amount ? amount : 0;
        }
        return total;
    }

    this.amountOwed = function () {
        var total = this.totalCost();
        return total - this.amountPaid();
    }

    this.isOverdue = function () {
        var unpaid = this.unpaid(),
            now = moment().unix();
        return unpaid && (now > this.paymentDeadline());
    }
}

export function Invoices() {
    this.resource = '/invoices';
    this.json = 'invoices';
    this.single = Invoice;

    this.get = function (success, error, parameters) {
        var self = this;
         function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
