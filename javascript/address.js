import { generateUUID } from './uuid.js';
import { addPropertyTo, fromJson, getOne, fromJsonList,
    Request } from './model.js'
import { isUndefinedOrNull } from './helpers.js';
import { Dictionary } from './dictionary.js';

export function Address() {
    this.resource = '/addresses';
    this.json = 'address';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'lineOne');
    addPropertyTo(this, 'lineTwo');
    addPropertyTo(this, 'city');
    addPropertyTo(this, 'state');
    addPropertyTo(this, 'country');
    addPropertyTo(this, 'postcode');

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
    this.fullAddressString = function () {
        var self = this, a = '', space = ' ', noSpace = '';
        function attributeHasValue(attr, before, after) {
            var value = self[attr]();
            return !isUndefinedOrNull(value) ? before + value + after : '';
        }
        a = attributeHasValue('lineOne', noSpace, noSpace);
        a += attributeHasValue('lineTwo', space, ',');
        a += attributeHasValue('city', space, space);
        a += attributeHasValue('state', noSpace, space);
        a += attributeHasValue('postcode', noSpace, space);
        a += attributeHasValue('country', noSpace, noSpace);
        return a;
    };

    this.stateAndCountryString = function () {
        var addressString = '';
        addressString += this.state() + " ";
        addressString += this.country();
        return addressString;
    };

    this.cityStateCountryPostcode = function () {
        return this.city() + " " + this.stateAndCountryString() +
            ", " + this.postcode();
    }

    this.isValid = function () {
        return Boolean(this.lineOne() && this.city() &&
            this.state() && this.country());
    }
}


export function Addresses() {
    this.resource = '/addresses';
    this.json = 'addresses';
    this.single = Address;

    this.getRelated = function (options) {
        var request = new Request(),
            query = new Dictionary(),
            self = this,
            success = options.success,
            error = options.error,
            userId = options.userId,
            companyId = options.companyId,
            jobId = options.jobId;
        if (userId) {
            query.add('user_id', userId);
        }
        if (companyId) {
            query.add('company_id', companyId);
        }
        if (jobId) {
            query.add('job_id', jobId);
        }
        request.resource('/related-addresses/');
        request.method('GET');
        request.query().merge(query);
        function handleResponse(status, data) {
            if (status === 200) {
                success(fromJsonList(self, data));
           } else {
                error(data);
            }
        }
        function handleError(status, data) {
            var responseData = data ? data :
                {message: 'could not connect to server',
                   errorCode: 0}
            error(status, responseData);
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    };
}
