import { generateUUID } from './uuid.js';
import { addPropertyTo, getList, fromJsonList } from './model.js';

export function EmailAddress() {
    this.resource = '/email_addresses';
    this.json = 'emailAddress';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'emailAddress');
}

export function EmailAddresses() {
    this.resource = '/email_addresses';
    this.json = 'emailAddresses';
    this.single = EmailAddress;

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
