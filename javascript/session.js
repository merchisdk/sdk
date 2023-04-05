import { Dictionary } from './dictionary.js';
import { addPropertyTo, create, fromJson, getOne, deleteOne, fromJsonList,
    getList, Request } from './model.js';
import { User } from './user.js';
import { Domain } from './domain.js';

export function Session() {
    this.resource = '/sessions';
    this.json = 'session';

    addPropertyTo(this, 'ip');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'token');
    addPropertyTo(this, 'remember');

    this.create = function (success, error, embed, username, password) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                success: handleResponse,
                error: error,
                embed: embed,
                username: username,
                password: password});
    };

    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.token(),
                success: handleResponse,
                error: error,
                embed: embed});
    };

    this.remove = function (success, error) {
        deleteOne(this.resource, success, error);
    };

    this.storeCreate = function (success, error, parameters) {
        var request = new Request(),
            query = new Dictionary(),
            password = parameters.password,
            remember = parameters.remember,
            storeName = parameters.storeName,
            username = parameters.email;
            self = this;

        if (password) {
            request.password(password);
        }

        if (remember) {
            query.add('remember', remember);
        }

        if (storeName) {
            query.add('storeName', storeName);
        }

        if (username) {
            request.username(username);
        }
        request.resource('/store-session/');
        request.method('POST');
        request.query().merge(query);
        function handleResponse(status, data) {
            success(fromJson(self, data[self.json]));
        }
        function handleError(status, data) {
            var statusCode = status ? status : 400,
                errorObject = data ? data :
                    {message: 'could not connect to server',
                     errorCode: 0};
            error(statusCode, errorObject);
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }
}

export function Sessions() {
    this.resource = '/sessions';
    this.json = 'sessions';
    this.single = Session;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                parameters);
    };
}
