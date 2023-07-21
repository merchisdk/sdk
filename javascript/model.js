import { id, isUndefined, notEmpty, getGlobal } from './helpers.js';
import { Dictionary } from './dictionary.js';
import { Set } from './set.js';
import axios from 'axios';


export function Request() {

    var server = getGlobal().merchiBackendUri,
        version = 'v6',
        method = 'GET',
        resource = '/',
        query = new Dictionary(),
        data = new Dictionary(),
        files = new Dictionary(),
        responseHandler = id,
        errorHandler = id,
        contentType = null,
        username = null,
        password = null;

    this.server = function (value) {
        if (isUndefined(value)) {
            return server;
        }
        server = value;
        return this;
    };

    this.version = function (value) {
        if (isUndefined(value)) {
            return version;
        }
        version = value;
        return this;
    };

    this.method = function (value) {
        if (isUndefined(value)) {
            return method;
        }
        method = value;
        return this;
    };

    this.resource = function (value) {
        if (isUndefined(value)) {
            return resource;
        }
        resource = value;
        return this;
    };

    this.query = function () {
        return query;
    };

    this.data = function () {
        return data;
    };

    this.files = function (value) {
        if (isUndefined(value)) {
            return files;
        }
        files = value;
        return this;
    };
    this.responseHandler = function (value) {
        if (isUndefined(value)) {
            return responseHandler;
        }
        responseHandler = value;
        return this;
    };

    this.errorHandler = function (value) {
        if (isUndefined(value)) {
            return errorHandler;
        }
        errorHandler = value;
        return this;
    };

    this.contentType = function (value) {
        if (isUndefined(value)) {
            return contentType;
        }
        contentType = value;
        return this;
    };

    this.username = function (value) {
        if (isUndefined(value)) {
            return username;
        }
        username = value;
        return this;
    };

    this.password = function (value) {
        if (isUndefined(value)) {
            return password;
        }
        password = value;
        return this;
    };

    this.p2pSupported = function () {
        return false;
    };

    this.url = function () {
        return this.server() + this.path();
    };

    this.path = function () {
        var url = this.version();
        url += this.resource();
        if (Boolean(getGlobal().currentSession) &&
            Boolean(getGlobal().currentSession.token())) {
            this.query().add('session_token',
                getGlobal().currentSession.token());
        }
        if (this.query().count() > 0) {
            url += '?' + this.query().toUriEncoding();
        }
        return url;
    };

    this.send = function () {
        var self = this, allData, params;
        allData = self.data();
        allData.merge(self.files());
        params = {
            'url': self.url(),
            'data': allData.toFormData(),
            'method': self.method()
        }
        if (self.username() !== null) {
            params.auth = {
                username: self.username(),
                password: self.password()
            }
        }
        if (self.contentType() !== null) {
            params.headers = {
                'Content-Type': self.contentType()
            }
        }
        return axios(params)
            .then(response => handleResponse(response))
            .catch(error => {
                //console.log(`${error.response.status} ${JSON.stringify(error.response.data)}`);
                handleError(error)
            });

        function handleResponse(response) {
            const func = self.responseHandler();
            const argCount = func.length;
            const data = response.data;

            if (argCount > 1) {
                func(response.status, data);
            } else {
                func(response.data);
            }
        }

        function handleError(error) {
            const func = self.errorHandler();
            const argCount = func.length;
            if (argCount > 1) {
                console.log(`Error ${JSON.stringify(error.response)}`)
                func(error.status, error);
            } else {
                func(data);
            }
        }
    };
}

export function forEachProperty(obj, procedure) {
    obj._properties.each(function (property) {
        // elem in _propertiesSet is array
        // 0 is name, 1 is type
        procedure(property[0], property[1]);
    });
}

export function fromJson(model, json, options) {
    var defaults = { makesDirty: true };
    options = Object.assign({}, defaults, options);
    forEachProperty(model, function (propName, Type) {
        try {
            var received = json[propName],
                parsed;

            if (!Type || typeof received === 'number') {
                // Prop is untyped or only id received
                model[propName](received, { makesDirty: options.makesDirty });
            } else {
                // Prop is typed and other thing rather than
                // single id received
                if (received instanceof Array) {
                    if (received.length > 0 &&
                        received[0] instanceof Object) {
                        // response has embed obj
                        parsed = fromJsonList(new Type(), received,
                            options);
                    } else {
                        // response is id array
                        parsed = received;
                    }
                } else {
                    // Embed Object received
                    parsed = fromJson(new Type(), received, options);
                }
                model[propName](parsed, { makesDirty: options.makesDirty });
            }
        } catch (ignore) {
        }
    });
    model.rights = json.rights;
    return model;
}

export function fromJsonList(obj, json, options) {
    var result = [],
        list,
        i,
        single;

    var defaults = { makesDirty: true };
    options = Object.assign({}, defaults, options);

    // When request plural eg /users, it gives typed json list
    // But when request embed data, annonymous json list returned
    if (json.constructor === Array) {
        // Embed data process
        list = json;
        for (i = 0; i < list.length; ++i) {
            single = new obj.constructor();
            result.push(fromJson(single, list[i], options));
        }
        return result;
    }
    // Plural request eg /users
    list = json[obj.json];

    for (i = 0; i < list.length; ++i) {
        single = new obj.single();
        result.push(fromJson(single, list[i][single.json], options));
    }

    // Append meta data for pagination,
    // workaroundbackward compatibility
    result.meta = {
        available: json.available,
        count: json.count,
        canCreate: json.canCreate,
        limit: json.limit,
        offset: json.offset
    };

    return result;
}

export function getList(resource, success, error, parameters, withUpdates) {

    var request = new Request();

    request.resource(resource + '/').method('GET');
    request.responseHandler(success).errorHandler(error);

    if (notEmpty(parameters.cartToken)) {
        request.query().add('cart_token', parameters.cartToken);
    }
    if (notEmpty(parameters.offset)) {
        request.query().add('offset', parameters.offset);
    }
    if (notEmpty(parameters.limit)) {
        request.query().add('limit', parameters.limit);
    }
    if (notEmpty(parameters.q)) {
        request.query().add('q', parameters.q);
    }
    if (notEmpty(parameters.sort)) {
        request.query().add('sort', parameters.sort);
    }
    if (notEmpty(parameters.order)) {
        request.query().add('order', parameters.order);
    }
    if (notEmpty(parameters.tab)) {
        request.query().add('tab', parameters.tab);
    }
    if (notEmpty(parameters.as)) {
        request.query().add('as', parameters.as);
    }
    if (!parameters.withRights) {
        request.query().add('skip_rights', 'y');
    }
    if (parameters.embed && parameters.embed.constructor === Object) {
        request.query().add('embed', JSON.stringify(parameters.embed));
    }
    if (notEmpty(parameters.state)) {
        request.query().add('state', parameters.state);
    }
    if (notEmpty(parameters.categoryId)) {
        request.query().add('category_id', parameters.categoryId);
    }
    if (notEmpty(parameters.platformCategoryId)) {
        request.query().add(
            'platform_category_id', parameters.platformCategoryId);
    }
    if (notEmpty(parameters.groupBuyForJobId)) {
        request.query().add(
            'group_buy_for_job_id', parameters.groupBuyForJobId);
    }
    if (notEmpty(parameters.inDomain)) {
        request.query().add('in_domain', parameters.inDomain);
    }
    if (notEmpty(parameters.inDomainName)) {
        request.query().add('in_domain_name', parameters.inDomainName);
    }
    if (parameters.inDomainRoles) {
        request.query().add('in_domain_roles',
            JSON.stringify(parameters.inDomainRoles));
    }
    if (parameters.asRole) {
        request.query().add('as_role', JSON.stringify(parameters.asRole));
    }
    if (parameters.groupBuyOnly) {
        request.query().add('group_buy_only',
            JSON.stringify(parameters.groupBuyOnly));
    }
    if (parameters.publicOnly) {
        request.query().add('public_only',
            JSON.stringify(parameters.publicOnly));
    }
    if (parameters.isPrivate) {
        request.query().add('is_private',
            JSON.stringify(parameters.isPrivate));
    }
    if (parameters.managedOnly) {
        request.query().add('managed_only',
            JSON.stringify(parameters.managedOnly));
    }
    if (parameters.doesNotHaveAdminDomain) {
        request.query().add('does_not_have_admin_domain',
            JSON.stringify(parameters.doesNotHaveAdminDomain));
    }
    if (parameters.teamOnly) {
        request.query().add('team_only',
            JSON.stringify(parameters.teamOnly));
    }
    if (parameters.clientOnly) {
        request.query().add('client_only',
            JSON.stringify(parameters.clientOnly));
    }
    if (parameters.memberOnly) {
        request.query().add('member_only',
            JSON.stringify(parameters.memberOnly));
    }
    if (parameters.merchiOnly) {
        request.query().add('merchi_only',
            JSON.stringify(parameters.merchiOnly));
    }
    if (parameters.supplierResellOnly) {
        request.query().add(
            'supplier_resell_only',
            JSON.stringify(parameters.supplierResellOnly));
    }
    if (parameters.inbound) {
        request.query().add(
            'inbound',
            JSON.stringify(parameters.inbound));
    }
    if (parameters.isMaster) {
        request.query().add(
            'is_master',
            JSON.stringify(parameters.isMaster));
    }
    if (parameters.domainRoles) {
        request.query().add('domain_roles', parameters.domainRoles);
    }
    if (parameters.domainTypes) {
        request.query().add('domain_types', parameters.domainTypes);
    }
    if (parameters.entityTypes) {
        request.query().add('entity_types', parameters.entityTypes);
    }
    if (parameters.productTypes) {
        request.query().add('product_types', parameters.productTypes);
    }
    if (parameters.masterProduct) {
        request.query().add('master_product', parameters.masterProduct);
    }
    if (parameters.managedDomainsOnly) {
        request.query().add('managed_domains_only',
            JSON.stringify(parameters.managedDomainsOnly));
    }
    if (parameters.businessDomainsOnly) {
        request.query().add('business_domains_only',
            JSON.stringify(parameters.businessDomainsOnly));
    }
    if (notEmpty(parameters.dateFrom)) {
        request.query().add('date_from', parameters.dateFrom);
    }
    if (notEmpty(parameters.dateTo)) {
        request.query().add('date_to', parameters.dateTo);
    }
    if (notEmpty(parameters.relatedAssignment)) {
        request.query().add('related_assignment', parameters.relatedAssignment);
    }
    if (notEmpty(parameters.relatedDraft)) {
        request.query().add('related_draft', parameters.relatedDraft);
    }
    if (notEmpty(parameters.relatedJob)) {
        request.query().add('related_job', parameters.relatedJob);
    }
    if (notEmpty(parameters.relatedProduct)) {
        request.query().add('related_product', parameters.relatedProduct);
    }
    if (notEmpty(parameters.jobNotifiable)) {
        request.query().add('job_notifiable',
            parameters.jobNotifiable);
    }
    if (notEmpty(parameters.notificationType)) {
        request.query().add('notification_type',
            parameters.notificationType);
    }
    if (notEmpty(parameters.notificationRecipient)) {
        request.query().add('notification_recipient',
            parameters.notificationRecipient);
    }
    if (notEmpty(parameters.notificationJob)) {
        request.query().add('notification_job',
            parameters.notificationJob);
    }
    if (notEmpty(parameters.relatedUser)) {
        request.query().add('related_user', parameters.relatedUser);
    }
    if (notEmpty(parameters.clientId)) {
        request.query().add('client_id', parameters.clientId);
    }
    if (notEmpty(parameters.clientCompanyId)) {
        request.query().add('client_company_id',
            parameters.clientCompanyId);
    }
    if (parameters.savedByUser) {
        request.query().add('saved_by_user',
            JSON.stringify(parameters.savedByUser));
    }
    if (parameters.receiverId) {
        request.query().add('receiver_id',
            JSON.stringify(parameters.receiverId));
    }
    if (notEmpty(parameters.queryString)) {
        request.query().add('query_string',
            parameters.queryString);
    }
    if (notEmpty(parameters.companyCustomerId)) {
        request.query().add('company_customer_id',
            parameters.companyCustomerId);
    }
    if (notEmpty(parameters.companyId)) {
        request.query().add('company_id', parameters.companyId);
    }
    if (notEmpty(parameters.companySupplierId)) {
        request.query().add('company_supplier_id',
            parameters.companySupplierId);
    }
    if (notEmpty(parameters.componentId)) {
        request.query().add('component_id', parameters.componentId);
    }
    if (notEmpty(parameters.section)) {
        request.query().add('section', parameters.section);
    }
    if (notEmpty(parameters.senderRole)) {
        request.query().add('senderRole', parameters.section);
    }
    if (notEmpty(parameters.isOrder)) {
        request.query().add('is_order', parameters.isOrder);
    }
    if (notEmpty(parameters.tags)) {
        request.query().add('tags', parameters.tags);
    }
    if (parameters.tagNames) {
        request.query().add('tag_names', parameters.tagNames);
    }
    if (notEmpty(parameters.exclude)) {
        request.query().add('exclude', parameters.exclude);
    }
    if (notEmpty(parameters.excludeComponents)) {
        request.query().add(
            'exclude_components', parameters.excludeComponents);
    }
    if (notEmpty(parameters.excludeDomains)) {
        request.query().add(
            'exclude_domains', parameters.excludeDomains);
    }
    if (notEmpty(parameters.includeOnly)) {
        request.query().add('include_only', parameters.includeOnly);
    }
    if (notEmpty(parameters.orClientId)) {
        request.query().add('or_client_id', parameters.orClientId);
    }
    if (notEmpty(parameters.shopifyOnly)) {
        request.query().add('shopify_only',
            parameters.shopifyOnly);
    }
    if (notEmpty(parameters.relatedComponent)) {
        request.query().add('related_component',
                            parameters.relatedComponent);
    }
    if (notEmpty(parameters.originalOf)) {
        request.query().add('original_of',
                            parameters.originalOf);
    }
    request.send();
    if (withUpdates) {
        return getGlobal().merchiSusubscriptionManager.subscribe(
            withUpdates, request.path(), "GET",
            function (statusCode, data) { return success(JSON.parse(data)) }
        );
    }
    return null;
}

export function serialise(obj, existing, prefix, files, options) {
    var result = new Dictionary(),
        index,
        excludeOld;
    options = options ? options : {};
    excludeOld = !!options.excludeOld;
    if (Boolean(existing)) {
        result = existing;
    }
    if (!files) {
        files = [];
    }
    function appendData(name, value) {
        if (!isUndefined(value) && value !== null) {
            if (Boolean(prefix)) {
                result.add(prefix + '-' + name, value);
            }
            else {
                result.add(name, value);
            }
        }
    }
    if (Boolean(obj.fileData)) {
        index = files.length;
        files.push(obj.fileData);
        appendData('fileDataIndex', index);
    }
    forEachProperty(obj, function (property, Type) {
        var value = obj[property](),
            i,
            innerPrefix,
            nested;
        if (!isUndefined(Type) && Boolean(Type)) {
            // serialise relationship
            var updatingOrder = obj._updatingOrder[property];
            if (updatingOrder) {
                appendData(property + '-*updateOrder', 'true');
            }
            if (value instanceof Array) {
                var isDirty = false;
                for (i = 0; i < value.length; i++) {
                    if (!!value[i]._isDirty) {
                        isDirty = true;
                        break;
                    }
                }
                if (excludeOld && !(obj._wantsUpdate[property] ||
                    isDirty)) {
                    return;
                }
                if (value && value.length === 0) {
                    appendData(property + '-count', 0);
                }
                // multiple remove entities
                var childrenSerialised = 0;
                for (i = 0; i < value.length; ++i) {
                    innerPrefix = property + '-' + i;
                    if (Boolean(prefix)) {
                        innerPrefix = prefix + '-' + innerPrefix;
                    }
                    var initialCount = result.count();
                    nested = serialise(value[i], result, innerPrefix,
                        files, options);
                    if (result.count() > initialCount) {
                        childrenSerialised += 1;
                    }
                    result = nested[0];
                    files = nested[1];

                    if (childrenSerialised > 0) {
                        appendData(property + '-count', childrenSerialised);
                    }
                }
            } else if (Boolean(value)) {
                // one remote entity
                if (excludeOld && !(obj._wantsUpdate[property] ||
                    value._isDirty)) {
                    return;
                }
                innerPrefix = property + '-0';
                if (Boolean(prefix)) {
                    innerPrefix = prefix + '-' + innerPrefix;
                }
                initialCount = result.count();
                nested = serialise(value, result, innerPrefix, files,
                    options);
                if (result.count() > initialCount) {
                    appendData(property + '-count', 1);
                }
                result = nested[0];
                files = nested[1];
            }
        } else {
            // serialise scalar
            if (excludeOld && !obj._wantsUpdate[property] &&
                property !== 'id') {
                return;
            }
            appendData(property, value);
        }
    });
    return [result, files];
}

function markDirty(obj) {
    /* mark this object, and recursively all objects that have refered to it,
        as changed compared to the backend. */
    var openSet = [];  /* Queue (BFS) */
    var closedSet = new Set();
    openSet.push(obj);
    while (openSet.length > 0) {
        var current = openSet.shift();
        if (!closedSet.has(current)) {
            current._isDirty = true;
            closedSet.add(current);
            current._backObjects.each(function (child) {
                openSet.push(child);
            });
        }
    }
}

export function addPropertyTo(obj, propertyName, Type) {
    obj._isMerchiEntity = true;
    if (!Object.prototype.hasOwnProperty.call(obj, '_wantsUpdate')) {
        obj._wantsUpdate = {};
    }
    obj._wantsUpdate[propertyName] = false;
    if (!Object.prototype.hasOwnProperty.call(obj, '_isDirty')) {
        obj._isDirty = false;
    }
    if (!Object.prototype.hasOwnProperty.call(obj, '_backObjects')) {
        obj._backObjects = new Set();
    }
    if (!Object.prototype.hasOwnProperty.call(obj, '_properties')) {
        obj._properties = new Set();
    }
    if (!Object.prototype.hasOwnProperty.call(obj, '_updatingOrder')) {
        obj._updatingOrder = {};
    }
    var hiddenProperty = '_' + propertyName;
    if (isUndefined(Type)) {
        Type = null;
    }

    obj._properties.add([propertyName, Type]);
    obj[propertyName] = function (value, options) {
        if (isUndefined(options)) {
            options = {};
        }
        if (isUndefined(options.makesDirty)) {
            options.makesDirty = true;
        }
        if (isUndefined(options.updatingOrder)) {
            options.updatingOrder = false;
        }
        if (isUndefined(value)) {
            return obj[hiddenProperty];
        }
        obj[hiddenProperty] = value;
        if (options.makesDirty) {
            obj._wantsUpdate[propertyName] = true;
            markDirty(obj);
        }
        obj._updatingOrder[propertyName] = options.updatingOrder;
        if (!!value && !!value._isMerchiEntity) {
            value._backObjects.add(obj);
        } else if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                var item = value[i];
                if (!!item._isMerchiEntity) {
                    item._backObjects.add(obj);
                }
            }
        }
        return obj;
    };
}

export function patchOne(options) {
    var request = new Request(),
        id = options.id;
    options.resource = options.resource || '';
    options.id = options.id || '';
    options.data = options.data || {};
    options.success = options.success || id;
    //options.data.cart_token = options.cartToken
    options.error = options.error || id;
    options.files = options.files || new Dictionary();

    request.resource(options.resource + '/' + options.id + '/').method('PATCH');
    request.files(options.files);
    request.data().merge(options.data);

    if (options.embed && options.embed.constructor === Object) {
        request.query().add('embed', JSON.stringify(options.embed));
    }
    if (notEmpty(options.as_domain)) {
        request.query().add('as_domain', options.as_domain);
    }
    if (options.cartToken) {
        request.query().add('cart_token', options.cartToken);
    }
    if (!options.withRights) {
        request.query().add('skip_rights', 'y');
    }
    request.responseHandler(options.success).errorHandler(options.error);
    request.send();
}

export function getOne(options) {
    var request = new Request(),
        error = options.error,
        embed = options.embed;

    request.resource(
        options.resource + '/' + options.id + '/').method('GET');

    if (embed && embed.constructor === Object) {
        embed = JSON.stringify(embed);
        request.query().add('embed', embed);
    }

    if (options.includeArchived) {
        request.query().add("include_archived", true);
    }

    if (options.cartToken) {
        request.query().add('cart_token', options.cartToken);
    }

    if (!options.withRights) {
        request.query().add('skip_rights', 'y');
    }
    request.responseHandler(options.success).errorHandler(error);
    request.send();
}

export function deleteOne(resource, success, error) {
    var request = new Request();
    request.resource(resource + '/').method('DELETE');
    request.responseHandler(success).errorHandler(error);
    request.send();
}

export function deleteOneV2(options) {
    var request = new Request();
    request.resource(options.resource + '/').method('DELETE');
    if (options.cartToken) {
        request.data().merge({ 'cart_token': options.cartToken })
    }
    if (!options.withRights) {
        request.data().merge({ 'skip_rights': 'y' })
    }
    request.responseHandler(options.success).errorHandler(options.error);
    request.send();
}

export function create(options) {
    var request = new Request(), embed;
    options.resource = options.resource || '';
    options.parameters = options.parameters || new Dictionary();
    options.success = options.success || id;
    options.error = options.error || id;
    options.files = options.files || new Dictionary();
    request.resource(options.resource + '/').method('POST');
    request.data().merge(options.parameters);
    request.files(options.files);
    if (!isUndefined(options.username)) {
        request.username(options.username);
        request.password(options.password);
    }
    if (options.embed && options.embed.constructor === Object) {
        embed = JSON.stringify(options.embed);
        request.query().add('embed', embed);
    }
    if (notEmpty(options.as_domain)) {
        request.query().add('as_domain', options.as_domain);
    }
    if (!options.withRights) {
        request.query().add('skip_rights', 'y');
    }
    request.responseHandler(options.success).errorHandler(options.error);
    request.send();
}

export function enumerateFiles(files) {
    /* Convert a list to a Dictionary where the keys where the indices
       and the values where the values at those indices.
     */
    var i,
        result = new Dictionary();
    for (i = 0; i < files.length; ++i) {
        result.add(i, files[i]);
    }
    return result;
}

export function recoverOne(model, id, success, error) {
    var request = new Request();
    request.resource("/unarchive/" + model + '/' + id + '/').method('POST');
    request.responseHandler(success).errorHandler(error);
    request.send();
}
