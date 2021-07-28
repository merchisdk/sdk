import { addPropertyTo, serialise, getList, fromJsonList, fromJson, patchOne } from './model.js';

export function EmailCounter() {
    this.resource = '/email_counters';
    this.json = 'emailCounter';

    addPropertyTo(this, 'emailAddress');
    addPropertyTo(this, 'unsubscribed');
    addPropertyTo(this, 'silenced');
    addPropertyTo(this, 'tokens');

    this.patch = function (success, error, embed) {
        var self = this,
            data = serialise(this, undefined, undefined, undefined,
                             {excludeOld: true})[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        patchOne({resource: this.resource,
                  id: this.emailAddress(),
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };
}

export function EmailCounters() {
    this.resource = '/email_counters';
    this.json = 'emailCounters';
    this.single = EmailCounter;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                parameters);
    };
}
