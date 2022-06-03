import { generateUUID } from './uuid';
import { Dictionary } from './dictionary';
import { addPropertyTo, fromJson, getOne, serialise, create, enumerateFiles,
    getList, fromJsonList, deleteOne, Request } from './model';

export function MerchiFile() {
    this.resource = '/files';
    this.json = 'file';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'size');
    addPropertyTo(this, 'mimetype');
    addPropertyTo(this, 'downloadUrl');
    addPropertyTo(this, 'viewUrl');
    addPropertyTo(this, 'server_url');

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
    this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                success: handleResponse,
                as_domain: as_domain,
                error: error,
                embed: embed});
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };
    this.publicCreate = function (success, error) {
        var self = this,
            filesObject = serialise(this),
            request = new Request(),
            jsonBody;
        request.resource('/public-upload-job-files/');
        request.method('POST');
        request.files(enumerateFiles(filesObject[1]));
        function handleResponse(status, body) {
            var result = '';
            if (status === 201) {
                try {
                    jsonBody = JSON.parse(body);
                    result = fromJson(self, jsonBody[self.json]);
                    success(result);
                } catch (e) {
                    result = {message: 'invalid json from server'};
                    error(result);
                }
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Unable to upload files.'};
                }
                error(result);
            }
        }
        function handleError(status, data) {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    };
    this.fromString = function (name, mimetype, data) {
        this.name(name);
        this.mimetype(mimetype);
        this.size(data.length);
        this.fileData = new File([data], name, {type: mimetype});
        return this;
    };

    this.fromFormFile = function (file) {
        this.name(file.name);
        this.mimetype(file.type);
        this.size(file.size);
        this.fileData = file;
        return this;
    };

    this.isPdf = function () {
        return this.mimetype() === 'application/pdf' ||
            this.mimetype() === 'application/x-pdf';
    }

    this.isImage = function () {
        var imageTypeString = this.mimetype() ?
            this.mimetype().split('/')[0] : null;
        return imageTypeString === 'image';
    }

   this.fetchFileContents = function () {
        var downloadUrl = this.downloadUrl()
        return fetch(downloadUrl).then(
            function (response) {
                return response.text();
            });
    };
}

export function MerchiFiles() {
    this.resource = '/files';
    this.json = 'files';
    this.single = MerchiFile;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                parameters);
    };

    this.getUserFiles = function (success, error, parameters) {
        var self = this,
            query = new Dictionary(),
            request = new Request();

        if (parameters.limit) {
            query.add('limit', parameters.limit);
        }
        if (parameters.offset) {
            query.add('offset', parameters.offset);
        }
        if (parameters.order) {
            query.add('order', parameters.order);
        }
        if (parameters.q) {
            query.add('q', parameters.q);
        }
        if (parameters.sort) {
            query.add('sort', parameters.sort);
        }
        if (parameters.relatedUser) {
            query.add('related_user', parameters.relatedUser);
        }
        query.add('skip_rights', true);
        request.resource('/files/user/');
        request.method('GET');
        request.query().merge(query);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Invalid json from server',
                              errorCode: 0};
                }
                success(fromJsonList(self, result));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Unable to create order',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError(status, data) {
            var statusCode = status ? status : 400,
                errorObject = data ? JSON.parse(data) :
                    {message: 'could not connect to server',
                     errorCode: 0};
            error(statusCode, errorObject);
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }
}
