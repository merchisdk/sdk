import generateUUID from './uuid.js';
import { addPropertyTo, getList, fromJsonList } from './model.js';

export function PhoneNumber() {
    this.resource = '/phone_numbers';
    this.json = 'phoneNumber';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'number');
    addPropertyTo(this, 'code');
    addPropertyTo(this, 'localFormatNumber');
    addPropertyTo(this, 'internationalFormatNumber');
}

export function PhoneNumbers() {
    this.resource = '/phone_numbers';
    this.json = 'phoneNumbers';
    this.single = PhoneNumber;

    this.get = function (success, error, offset, limit, q) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                {offset: offset, limit: limit, q: q});
    };
}
