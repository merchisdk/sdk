import { generateUUID } from './uuid.js';
import { addPropertyTo, fromJson, getOne, serialise, enumerateFiles, patchOne,
    fromJsonList, getList, create } from './model.js';
import { MerchiFile } from './merchi_file.js';
import { ComponentTag } from './component_tag.js';
import { User } from './user.js';

export function Component() {
    this.resource = '/components';
    this.json = 'component';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'archived');
    addPropertyTo(this, 'componentImports');
    addPropertyTo(this, 'componentExports');
    addPropertyTo(this, 'created');
    addPropertyTo(this, 'updated');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'needsUpdate');
    addPropertyTo(this, 'body');
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'compiled');
    addPropertyTo(this, 'originalComponent', Component);
    addPropertyTo(this, 'createdBy', User);
    addPropertyTo(this, 'updatedBy', User);
    addPropertyTo(this, 'featureImage', MerchiFile);
    addPropertyTo(this, 'images', MerchiFile);
    addPropertyTo(this, 'tags', ComponentTag);

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

    this.create = function (success, error, embed, domainId) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed,
                as_domain: domainId});
    };

    this.patch = function (success, error, embed) {
        var self = this,
            data = serialise(this)[0];
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

  this.toReact = function (context) {
    const componentCode = 'with (this) { ' + this.compiled() + ' return ' +
      this.name() + ';}';
    const proxy = new Proxy(context, {});
    const callable = new Function(componentCode);
    return callable.call(proxy);
  }
}

export function Components() {
    this.resource = '/components';
    this.json = 'components';
    this.single = Component;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
