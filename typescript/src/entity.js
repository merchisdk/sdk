var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import 'reflect-metadata';
import { generateUUID } from './uuid';
function toUnixTimestamp(date) {
    return parseInt(String(date.getTime() / 1000)).toFixed(0);
}
export var SortOrder;
(function (SortOrder) {
    // eslint-disable-next-line no-unused-vars
    SortOrder[SortOrder["ASCENDING"] = 0] = "ASCENDING";
    // eslint-disable-next-line no-unused-vars
    SortOrder[SortOrder["DESCENDING"] = 1] = "DESCENDING";
})(SortOrder || (SortOrder = {}));
export var SerialiseMethod;
(function (SerialiseMethod) {
    // eslint-disable-next-line no-unused-vars
    SerialiseMethod["TO_DICT"] = "to_dict";
    // eslint-disable-next-line no-unused-vars
    SerialiseMethod["ONLY_ID"] = "only_id";
})(SerialiseMethod || (SerialiseMethod = {}));
var Entity = /** @class */ (function () {
    function Entity(merchi) {
        var _this = this;
        this.isDirty = false;
        this.backObjects = new Set();
        this.key = generateUUID();
        this.getPrimaryKeyValue = function () {
            var name = _this.constructor.primaryKey;
            var info = _this.propertiesMap.get(name);
            /* istanbul ignore next */
            if (info !== undefined) {
                return info.currentValue;
            }
            /* istanbul ignore next */
            return undefined;
        };
        this.setupProperties = function () {
            var e_1, _a;
            var properties = {};
            var makeSetSingle = function (info) {
                var get = function () {
                    return info.currentValue;
                };
                var set = function (newValue) {
                    _this.checkSameSession(newValue);
                    info.currentValue = newValue;
                    _this.addBackObject(newValue);
                    _this.markDirty(info.property, newValue);
                };
                return { get: get,
                    set: set };
            };
            var makeSetScalar = function (info) {
                var get = function () {
                    return info.currentValue;
                };
                var set = function (newValue) {
                    info.currentValue = newValue;
                    _this.markDirty(info.property, newValue);
                };
                return { get: get,
                    set: set };
            };
            var makeSetArray = function (info) {
                var get = function () {
                    return info.currentValue;
                };
                var set = function (newValue) {
                    info.currentValue = newValue;
                    _this.checkSameSessionList(newValue);
                    _this.addBackObjectList(newValue);
                    _this.markDirty(info.property, newValue);
                };
                return { get: get,
                    set: set };
            };
            try {
                for (var _b = __values(_this.propertiesMap.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var info = _c.value;
                    if (info.type.prototype instanceof Entity) {
                        properties[info.attribute] = makeSetSingle(info);
                    }
                    else if (info.arrayType) {
                        properties[info.attribute] = makeSetArray(info);
                    }
                    else {
                        properties[info.attribute] = makeSetScalar(info);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            Object.defineProperties(_this, properties);
        };
        this.save = function (options) {
            var primaryKey = _this.getPrimaryKeyValue();
            var constructor = _this.constructor;
            var resourceName = constructor.resourceName;
            var singularName = constructor.singularName;
            var resource = "/" + resourceName + "/" + String(primaryKey) + "/";
            var data = _this.toFormData();
            var fetchOptions = { method: 'PATCH',
                body: data };
            fetchOptions.query = [];
            if (options && options.embed) {
                fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
            }
            if (!(options && options.withRights)) {
                fetchOptions.query.push(['skip_rights', 'y']);
            }
            return _this.merchi.authenticatedFetch(resource, fetchOptions).then(function (data) {
                _this.fromJson(data[singularName]);
                return _this;
            });
        };
        this.createFactory = function (_a) {
            var _b = _a.resourceName, resourceName = _b === void 0 ? _this.constructor.resourceName : _b;
            return function () {
                var resource = "/" + resourceName + "/";
                var data = _this.toFormData();
                var singularName = _this.constructor.singularName;
                var fetchOptions = { method: 'POST',
                    body: data };
                return _this.merchi.authenticatedFetch(resource, fetchOptions).
                    then(function (data) {
                    _this.fromJson(data[singularName]);
                    return _this;
                });
            };
        };
        this.create = this.createFactory({});
        this.getEntityClass = function (name) {
            if (name === undefined) {
                return undefined;
            }
            return _this.merchi[name];
        };
        this.checkSameSession = function (other) {
            if (other !== undefined && other.merchi.sessionToken !== _this.merchi.sessionToken) {
                throw new Error('cannot mix objects from different sessions');
            }
        };
        this.checkSameSessionList = function (other) {
            if (other !== undefined) {
                other.map(_this.checkSameSession);
            }
        };
        this.fromJson = function (json, options) {
            options = options || {};
            var _a = options.makeDirty, makeDirty = _a === void 0 ? false : _a, _b = options.arrayValueStrict, arrayValueStrict = _b === void 0 ? true : _b;
            options = { makeDirty: makeDirty, arrayValueStrict: arrayValueStrict };
            var _loop_1 = function (key) {
                var value = json[key];
                if (value === undefined)
                    return "continue";
                var propertyInfo = _this.propertiesMap.get(key);
                if (propertyInfo !== undefined) {
                    propertyInfo.dirty = makeDirty;
                    if (propertyInfo.arrayType) {
                        // ignore array value if it is not an array and we did expect it
                        if (!arrayValueStrict && !Array.isArray(value))
                            return "continue";
                        var newValue = value.map(function (item, index) {
                            var currentValue = propertyInfo.currentValue;
                            // if property already have an array of entities as relationship,
                            // try to merge with json one by one, this behavior may need to be
                            // configurable in the future.
                            if (currentValue && currentValue[index]) {
                                return currentValue[index].fromJson(item, options);
                            }
                            var nested = new propertyInfo.arrayType(_this.merchi);
                            return nested.fromJson(item, options);
                        });
                        propertyInfo.currentValue = newValue;
                    }
                    else if (_this.isSingleEntityProperty(propertyInfo)) {
                        // if property already have a entity as relationship, try to merge
                        // with json first, this behavior may need to be configurable in the
                        // future.
                        if (propertyInfo.currentValue) {
                            propertyInfo.currentValue.fromJson(value, options);
                        }
                        else {
                            var nested = new propertyInfo.type(_this.merchi);
                            propertyInfo.currentValue = nested.fromJson(value, options);
                        }
                    }
                    else {
                        propertyInfo.currentValue = value;
                        if (propertyInfo.type === Date && !!value) {
                            propertyInfo.currentValue = new Date(value * 1000);
                        }
                    }
                }
            };
            for (var key in json) {
                _loop_1(key);
            }
            return _this;
        };
        this.toJson = function () {
            var e_2, _a;
            var json = {};
            try {
                for (var _b = __values(_this.propertiesMap.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var entry = _c.value;
                    var propertyName = entry[0];
                    var propertyInfo = entry[1];
                    if (propertyInfo.currentValue !== undefined) {
                        if (propertyInfo.arrayType) {
                            var array = propertyInfo.currentValue.map(function (v) { return v.toJson(); });
                            json[propertyName] = array;
                        }
                        else if (_this.isSingleEntityProperty(propertyInfo)) {
                            json[propertyName] = propertyInfo.currentValue.toJson();
                        }
                        else {
                            var value = propertyInfo.currentValue;
                            json[propertyName] = value;
                            if (propertyInfo.type === Date && !!value) {
                                json[propertyName] = value.getTime() / 1000;
                            }
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return json;
        };
        this.forEachProperty = function (fn) {
            var e_3, _a;
            try {
                for (var _b = __values(_this.propertiesMap.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var info = _c.value;
                    fn(info);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        this.toFormData = function (options, fileIndex) {
            if (options === undefined) {
                options = {};
            }
            var result = options.existing || new FormData();
            var prefix = options._prefix || '';
            var excludeOld = options.excludeOld === undefined ?
                true : options.excludeOld;
            if (fileIndex === undefined) {
                fileIndex = { value: 0 };
            }
            var appendData = function (name, value) {
                /* istanbul ignore next */
                if (name === undefined || value === undefined) {
                    /* istanbul ignore next */
                    return;
                }
                if (prefix) {
                    name = prefix + '-' + name;
                }
                result.set(name, value);
            };
            if (_this.fileData !== undefined) {
                result.set(String(fileIndex.value), _this.fileData);
                appendData('fileDataIndex', fileIndex.value);
                fileIndex.value++;
            }
            var processArrayProperty = function (info, value) {
                var e_4, _a;
                var remoteCount = value.length;
                var initialLength = Array.from(result.entries()).length;
                if (remoteCount === 0 && info.dirty) {
                    appendData(info.property + '-count', 0);
                    return;
                }
                var isDirty = false;
                try {
                    for (var value_1 = __values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                        var item = value_1_1.value;
                        if (item.isDirty) {
                            isDirty = true;
                            break;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                isDirty = isDirty || info.dirty;
                if (!isDirty && excludeOld) {
                    return;
                }
                for (var i = 0; i < remoteCount; ++i) {
                    var innerPrefix = info.property + '-' + i;
                    if (prefix) {
                        innerPrefix = prefix + '-' + innerPrefix;
                    }
                    value[i].toFormData({ existing: result, _prefix: innerPrefix, excludeOld: excludeOld }, fileIndex);
                }
                var finalLength = Array.from(result.entries()).length;
                if ((finalLength - initialLength) > 0) {
                    appendData(info.property + '-count', remoteCount);
                    if (info.updatingOrder) {
                        appendData(info.property + '-*updateOrder', 'true');
                    }
                }
            };
            var processSingleEntityProperty = function (info, value) {
                var primaryKey = _this.constructor.primaryKey;
                var innerPrefix = info.property + '-0';
                if (prefix) {
                    innerPrefix = prefix + '-' + innerPrefix;
                }
                if (value === null) {
                    if (info.dirty || !excludeOld) {
                        appendData(innerPrefix + '-' + primaryKey, '-1');
                        appendData(info.property + '-count', 1);
                    }
                    return;
                }
                if (!(info.dirty || (value.isDirty)) && excludeOld) {
                    return;
                }
                var initialLength = Array.from(result.entries()).length;
                value.toFormData({ existing: result, _prefix: innerPrefix, excludeOld: excludeOld }, fileIndex);
                var finalLength = Array.from(result.entries()).length;
                if ((finalLength - initialLength) > 0) {
                    appendData(info.property + '-count', 1);
                }
            };
            var processScalarProperty = function (info, value) {
                var primaryKey = _this.constructor.primaryKey;
                if (!excludeOld ||
                    info.dirty ||
                    (info.property === primaryKey && value)) {
                    if (info.type === Date && !!value) {
                        value = value.getTime() / 1000;
                    }
                    appendData(info.property, value);
                }
            };
            var processProperty = function (info) {
                var value = _this[info.attribute];
                if (value === undefined) {
                    return;
                }
                else if (info.arrayType) {
                    processArrayProperty(info, value);
                }
                else if (_this.isSingleEntityProperty(info)) {
                    processSingleEntityProperty(info, value);
                }
                else {
                    processScalarProperty(info, value);
                }
            };
            _this.forEachProperty(processProperty);
            return result;
        };
        this.addBackObject = function (remote) {
            if (remote !== undefined) {
                remote.backObjects.add(_this);
            }
        };
        this.addBackObjectList = function (remotes) {
            if (remotes !== undefined) {
                remotes.forEach(_this.addBackObject);
            }
        };
        this.updateOrder = function (property) {
            _this.propertiesMap.get(property).updatingOrder = true;
        };
        this.markDirty = function (property, newValue) {
            var e_5, _a;
            if (newValue === undefined) {
                return;
            }
            _this.propertiesMap.get(property).dirty = true;
            var openSet = []; /* Queue (BFS) */
            var closedSet = new Set();
            openSet.push(_this);
            while (openSet.length > 0) {
                var current = openSet.shift();
                if (!closedSet.has(current)) {
                    current.isDirty = true;
                    closedSet.add(current);
                    try {
                        for (var _b = (e_5 = void 0, __values(current.backObjects)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var child = _c.value;
                            openSet.push(child);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
            }
        };
        this.delete = function (options) {
            var primaryKey = _this.getPrimaryKeyValue();
            var resourceName = _this.constructor.resourceName;
            var resource = "/" + resourceName + "/" + String(primaryKey) + "/";
            var fetchOptions = { method: 'DELETE' };
            fetchOptions.query = [];
            if (!(options && options.withRights)) {
                fetchOptions.query.push(['skip_rights', 'y']);
            }
            if (_this.merchi.sessionToken) {
                fetchOptions.query.push(['session_token', _this.merchi.sessionToken]);
            }
            return _this.merchi.authenticatedFetch(resource, fetchOptions, true).then(function () { return _this; });
        };
        this.recover = function (options) {
            var primaryKey = _this.getPrimaryKeyValue();
            var constructor = _this.constructor;
            var resourceName = constructor.resourceName;
            var singularName = constructor.singularName;
            var resource = "/unarchive/" + resourceName + "/" + String(primaryKey) + "/";
            var fetchOptions = { method: 'POST' };
            fetchOptions.query = [];
            if (options && options.embed) {
                fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
            }
            if (!(options && options.withRights)) {
                fetchOptions.query.push(['skip_rights', 'y']);
            }
            return _this.merchi.authenticatedFetch(resource, fetchOptions).then(function (data) {
                _this.fromJson(data[singularName]);
                return _this;
            });
        };
        /* istanbul ignore next */
        if (merchi !== undefined) {
            this.merchi = merchi;
        }
        this.propertiesMap = this.makePropertiesMap();
        this.setupProperties();
    }
    Entity.prototype.isSingleEntityProperty = function (info) {
        // the choice of 'Product' below is unimportant -- all Entities should
        // have the same prototype but i don't know how to get instanceof
        // working, so i just compare prototypes directly.
        return (info.type.prototype === this.merchi.Product.prototype ||
            info.type.prototype instanceof Entity);
    };
    Entity.property = function (options) {
        return function (target, propertyKey) {
            if (!options) {
                options = {};
            }
            var arrayType = options.arrayType;
            var jsonName = options.jsonName || propertyKey;
            var properties = Reflect.getMetadata(Entity.propertiesSetKey, target.constructor);
            properties = properties || new Set();
            properties.add(propertyKey);
            Reflect.defineMetadata(Entity.propertiesSetKey, properties, target.constructor);
            Reflect.defineMetadata(Entity.jsonNameKey, jsonName, target, propertyKey);
            Reflect.defineMetadata(Entity.arrayTypeKey, arrayType, target, propertyKey);
            Reflect.defineMetadata(Entity.extraOptionsKey, options, target, propertyKey);
        };
    };
    Entity.prototype.makePropertiesMap = function () {
        var map = new Map();
        var self = this;
        var properties = Reflect.getMetadata(Entity.propertiesSetKey, this.constructor);
        properties.forEach(function (attributeName) {
            var jsonName = Reflect.getMetadata(Entity.jsonNameKey, self, attributeName);
            var propertyType = Reflect.getMetadata('design:type', self, attributeName);
            // the array type is needed because 'design:type' breaks down
            // with recursive classes, and also, does not contain the type
            // of an arrays elements, which we need
            var arrayType = Reflect.getMetadata(Entity.arrayTypeKey, self, attributeName);
            var realArrayType = self.getEntityClass(arrayType);
            var options = Reflect.getMetadata(Entity.extraOptionsKey, self, attributeName);
            if (arrayType !== undefined) {
                /* istanbul ignore next */
                if (propertyType !== Object && propertyType !== Array) {
                    /* istanbul ignore next */
                    throw new Error('array type can only be given for arrays');
                }
            }
            var normallyEmbeddedByDefault = !(realArrayType ||
                propertyType.prototype instanceof Entity);
            var embeddedByDefault = options.embeddedByDefault !== undefined ?
                options.embeddedByDefault : normallyEmbeddedByDefault;
            var type;
            if (options.type === undefined) {
                type = propertyType;
            }
            else {
                type = options.type;
                if (typeof type === 'string') {
                    type = self.getEntityClass(type);
                }
                if (type.prototype instanceof Entity) {
                    type = self.merchi.setupClass(type);
                }
            }
            /* istanbul ignore next */
            if (type === Object) {
                /* istanbul ignore next */
                var resource = self.constructor.resourceName;
                var err = 'Bad attribute type ' +
                    (resource + "." + attributeName + ": " + type);
                throw new Error(err);
            }
            var propertyInfo = { property: jsonName,
                attribute: attributeName,
                type: type,
                arrayType: realArrayType,
                embeddedByDefault: embeddedByDefault,
                dirty: true,
                updatingOrder: false };
            map.set(jsonName, propertyInfo);
        });
        return map;
    };
    Entity.get = function (key, options) {
        var _this = this;
        var resource = "/" + this.resourceName + "/" + String(key) + "/";
        var fetchOptions = {};
        fetchOptions.query = [];
        if (options && options.embed) {
            fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
        }
        if (options && options.includeArchived) {
            fetchOptions.query.push(['include_archived', 'true']);
        }
        if (!(options && options.withRights)) {
            fetchOptions.query.push(['skip_rights', 'y']);
        }
        return this.merchi.authenticatedFetch(resource, fetchOptions).
            then(function (data) {
            var result = (new _this());
            result.fromJson(data[_this.singularName]);
            return result;
        });
    };
    Entity.list = function (options) {
        var _this = this;
        var resource = "/" + this.resourceName + "/";
        var fetchOptions = {};
        fetchOptions.query = [];
        if (options) {
            if (options.embed) {
                fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
            }
            if (options.offset !== undefined) {
                fetchOptions.query.push(['offset', options.offset.toString()]);
            }
            if (options.limit !== undefined) {
                fetchOptions.query.push(['limit', options.limit.toString()]);
            }
            if (options.q !== undefined) {
                fetchOptions.query.push(['q', options.q]);
            }
            if (options.sort !== undefined) {
                fetchOptions.query.push(['sort', options.sort]);
            }
            if (options.order !== undefined) {
                if (options.order === SortOrder.ASCENDING) {
                    fetchOptions.query.push(['order', 'asc']);
                }
                else {
                    fetchOptions.query.push(['order', 'desc']);
                }
            }
            if (options.serialiseMethod !== undefined) {
                fetchOptions.query.push(['serialise_method', options.serialiseMethod]);
            }
            if (options.tab !== undefined) {
                fetchOptions.query.push(['tab', options.tab]);
            }
            if (options.as !== undefined) {
                fetchOptions.query.push(['as', options.as]);
            }
            if (options.state !== undefined) {
                fetchOptions.query.push(['state', options.state]);
            }
            if (options.categoryId !== undefined) {
                fetchOptions.query.push(['category_id', options.categoryId.toString()]);
            }
            if (options.inDomain !== undefined) {
                fetchOptions.query.push(['in_domain', options.inDomain.toString()]);
            }
            if (options.inDomainName !== undefined) {
                fetchOptions.query.push(['in_domain_name', options.inDomainName.toString()]);
            }
            if (options.inDomainRoles !== undefined) {
                fetchOptions.query.push(['in_domain_roles',
                    JSON.stringify(options.inDomainRoles)]);
            }
            if (options.asRole !== undefined) {
                fetchOptions.query.push(['as_role', options.asRole.toString()]);
            }
            if (options.publicOnly !== undefined) {
                fetchOptions.query.push(['public_only', options.publicOnly.toString()]);
            }
            if (options.managedOnly !== undefined) {
                fetchOptions.query.push(['managed_only',
                    options.managedOnly.toString()]);
            }
            if (options.memberOnly !== undefined) {
                fetchOptions.query.push(['member_only', options.memberOnly.toString()]);
            }
            if (options.domainRoles !== undefined) {
                fetchOptions.query.push(['domain_roles',
                    options.domainRoles.join(',')]);
            }
            if (options.managedDomainsOnly !== undefined) {
                fetchOptions.query.push(['managed_domains_only',
                    options.managedDomainsOnly.toString()]);
            }
            if (options.businessDomainsOnly !== undefined) {
                fetchOptions.query.push(['business_domains_only',
                    options.businessDomainsOnly.toString()]);
            }
            if (options.dateFrom !== undefined) {
                fetchOptions.query.push(['date_from',
                    toUnixTimestamp(options.dateFrom)]);
            }
            if (options.dateTo !== undefined) {
                fetchOptions.query.push(['date_to', toUnixTimestamp(options.dateTo)]);
            }
            if (options.relatedAssignment !== undefined) {
                fetchOptions.query.push(['related_assignment',
                    options.relatedAssignment.toString()]);
            }
            if (options.relatedJob !== undefined) {
                fetchOptions.query.push(['related_job', options.relatedJob.toString()]);
            }
            if (options.relatedProduct !== undefined) {
                fetchOptions.query.push(['related_product',
                    options.relatedProduct.toString()]);
            }
            if (options.jobNotifiable !== undefined) {
                fetchOptions.query.push(['job_notifiable',
                    options.jobNotifiable.toString()]);
            }
            if (options.notificationType !== undefined) {
                fetchOptions.query.push(['notification_type',
                    options.notificationType.toString()]);
            }
            if (options.notificationRecipient !== undefined) {
                fetchOptions.query.push(['notification_recipient',
                    options.notificationRecipient.toString()]);
            }
            if (options.notificationJob !== undefined) {
                fetchOptions.query.push(['notification_job',
                    options.notificationJob.toString()]);
            }
            if (options.relatedUser !== undefined) {
                fetchOptions.query.push(['related_user',
                    options.relatedUser.toString()]);
            }
            if (options.clientId !== undefined) {
                fetchOptions.query.push(['client_id', options.clientId.toString()]);
            }
            if (options.clientCompanyId !== undefined) {
                fetchOptions.query.push(['client_company_id',
                    options.clientCompanyId.toString()]);
            }
            if (options.savedByUser !== undefined) {
                fetchOptions.query.push(['saved_by_user',
                    options.savedByUser.toString()]);
            }
            if (options.receiverId !== undefined) {
                fetchOptions.query.push(['receiver_id', options.receiverId.toString()]);
            }
            if (options.companyId !== undefined) {
                fetchOptions.query.push(['company_id', options.companyId.toString()]);
            }
            if (options.componentId !== undefined) {
                fetchOptions.query.push(['component_id',
                    options.componentId.toString()]);
            }
            if (options.section !== undefined) {
                fetchOptions.query.push(['section', options.section.toString()]);
            }
            if (options.senderRole !== undefined) {
                fetchOptions.query.push(['senderRole', options.senderRole.toString()]);
            }
            if (options.isOrder) {
                fetchOptions.query.push(['is_order', 'true']);
            }
            if (options.tags !== undefined) {
                fetchOptions.query.push(['tags', options.tags.join(',')]);
            }
            if (options.tagNames !== undefined) {
                fetchOptions.query.push(['tags_name', options.tagNames.join(',')]);
            }
            if (options.exclude !== undefined) {
                fetchOptions.query.push(['exclude', options.exclude.join(',')]);
            }
            if (options.includeOnly !== undefined) {
                fetchOptions.query.push(['include_only', options.includeOnly.join(',')]);
            }
        }
        if (!(options && options.withRights)) {
            fetchOptions.query.push(['skip_rights', 'y']);
        }
        return this.merchi.authenticatedFetch(resource, fetchOptions).then(function (data) {
            var e_6, _a;
            var metadata = { canCreate: data.canCreate,
                available: data.available,
                count: data.count,
                limit: data.limit,
                offset: data.offset };
            var pluralName = _this.pluralName;
            var singularName = _this.singularName;
            var items = data[pluralName];
            var entities = [];
            try {
                for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                    var item = items_1_1.value;
                    var entity = (new _this());
                    entity.fromJson(item[singularName]);
                    entities.push(entity);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return { items: entities,
                metadata: metadata };
        });
    };
    Entity.jsonNameKey = Symbol('jsonName');
    Entity.arrayTypeKey = Symbol('arrayType');
    Entity.extraOptionsKey = Symbol('extraOptions');
    Entity.propertiesSetKey = Symbol('propertiesSet');
    Entity.primaryKey = 'id';
    return Entity;
}());
export { Entity };
