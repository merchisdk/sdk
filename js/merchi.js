function merchi(backendUri, websocketUri) {
    "use strict";

    function isUndefined(x) {
        return x === undefined;
    }

    function isNull(x) {
        return x === null;
    }

    function isUndefinedOrNull(x) {
        return isUndefined(x) || isNull(x);
    }

    function notEmpty(value) {
        return !(isUndefined(value) || value === null || value === "");
    }

    function isArray(x) {
        return Array.isArray(x);
    }

    function notEmptyArray(array) {
        return isArray(array) && array.length > 0;
    }

    function isJSON(x) {
        return typeof x === 'object' && x !== null &&
            !(x instanceof Array) && !(x instanceof Date);
    }

    function isFunction(x) {
        return typeof x === 'function';
    }

    function sortArrayByObjectKey(array, objectKey) {
        array.sort(function (a, b) {
            return a[objectKey]() - b[objectKey]();
        });
        return array;
    }

    function removeObjectFromArrayBasedOnCondition(array, condition) {
        array.splice(array.findIndex(condition), 1);
    }

    function removeObjectFromArrayWithIntegerValue(array, objectKey, value) {
        var key = !objectKey ? objectKey : 'id',
            intValue = parseInt(value, 10);
        removeObjectFromArrayBasedOnCondition(array, function (obj) {
            return obj[key]() === intValue;
        });
    }

    function id(x) {
        return x;
    }

    function displayMoney(amount) {
        return parseFloat(amount).toFixed(2);
    }

    function clone(oldObject) {
        return $.extend(true, {}, oldObject);
    }

    function any(iterable, condition) {
        for (var index = 0; index < iterable.length; ++index) {
            if (!isUndefined(condition) && condition(iterable[index])) {
                return true;
            } else if (iterable[index]) {
                return true;
            }
        }
        return false;
    }

    function all(iterable) {
        for (var index = 0; index < iterable.length; ++index) {
            if (!iterable[index]) {
                return false;
            }
        }
        return true;
    }

    /** Basic Data Structure **/
    function Dictionary() {

        var store = {},
            count = 0;

        function noSuchKey(name) {
            throw 'No such key "' + String(name) + '" in dictionary';
        }

        this.clone = function () {
            return new Dictionary(store, count);
        };

        this.add = function (name, value) {
            if (!this.has(name)) {
                ++count;
            }
            store[name] = value;
            return this;
        };

        this.getArray = function (names) {
        /** passing a array of keys return the values array
         * corresponding to the keys **/
            var i, returnArray = [];
            for (i = 0; i < names.length; i++) {
                if (this.has(names[i])) {
                    returnArray.push(store[names[i]]);
                } else {
                    noSuchKey(names[i]);
                }
            }
            return returnArray;
        };

        this.get = function (name, default_) {
            if (this.has(name)) {
                return store[name];
            }
            if (default_ !== undefined) {
                return default_;
            }
            return noSuchKey(name);
        };

        this.has = function (name) {
            return Object.prototype.hasOwnProperty.call(store, name) &&
                Object.prototype.propertyIsEnumerable.call(store, name);
        };

        this.remove = function (name) {
            if (this.has(name)) {
                delete store[name];
                --count;
                return this;
            }
            return noSuchKey(name);
        };

        this.merge = function (other) {
            var _this = this;
            other.each(function (name, value) {
                _this.add(name, value);
            });
            return this;
        };

        this.each = function (procedure) {
            var name;
            for (name in store) {
                if (Object.prototype.hasOwnProperty.call(store, name)) {
                    procedure(name, store[name]);
                }
            }
            return this;
        };

        this.keys = function () {
            var result = [];
            this.each(function (name) { result.push(name); });
            return result;
        };

        this.values = function () {
            var result = [];
            this.each(function (ignore, value) { result.push(value); });
            return result;
        };

        this.count = function () {
            return count;
        };

        this.toFormData = function () {
            var result = new FormData();
            this.each(function (key, value) {
                result.append(key, value);
            });
            return result;
        };

        this.toUriEncoding = function () {
            var result = '';
            this.each(function (key, value) {
                if (typeof key === "object") {
                    throw "cannot URI encode object key";
                }
                if (typeof value === "object") {
                    throw "cannot URI encode object name";
                }
                result += encodeURIComponent(key);
                result += '=';
                result += encodeURIComponent(value);
                result += '&';
            });
            return result.slice(0, -1);
        };

    }

    function Set() {

        var store = new Dictionary();

        this.add = function (value) {
            store.add(value, value);
        };

        this.has = function (value) {
            store.has(value);
        };

        this.each = function (procedure) {
            store.each(function (name, value) { procedure(value); });
            return this;
        };

        this.values = function () {
            return store.values();
        };

        this.remove = function (value) {
            store.remove(value);
            return this;
        };

    }

    function generateUUID() {
        var d = new Date().getTime(),
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        if (window.performance &&
                typeof window.performance.now === "function") {
            d += performance.now();
        }
        uuid = uuid.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
        return uuid;
    }

    function enumerateFiles(files) {
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

    function SubscriptionManager() {

        var socket = null,
            subscriptions = new Dictionary();

        function handleUpdate(data) {
            var handler = subscriptions.get(data.subscriptionToken, null);
            if (handler !== null) {
                handler(data.statusCode, data.data);
            }
        }

        function getSocket() {
            if (socket === null) {
                socket = io.connect(websocketUri);
                socket.on('update', handleUpdate);
            }
            return socket;
        }

        function emit(name, data) {
            getSocket().emit(name, data);
        }

        this.subscribe = function (eventTypes, uri, method, onUpdate) {
            var subscriptionToken = generateUUID();
            subscriptions.add(subscriptionToken, onUpdate);
            emit('subscribe', {eventTypes: eventTypes,
                               method: method,
                               subscriptionToken: subscriptionToken,
                               uri: uri});
            return subscriptionToken;
        };

        this.unsubscribe = function (subscriptionToken) {
            subscriptions.remove(subscriptionToken);
            emit('unsubscribe', {subscriptionToken: subscriptionToken});
        };
    }

    /** Closures and file scope vars **/
    var roles = new Dictionary(),
        allRoles = new Set(),
        roleStrings = new Dictionary(),
        roleCssClass = new Dictionary(),
        rights = new Dictionary(),
        eventTypes = new Dictionary(),
        itemTypes = new Dictionary(),
        jobStatusProduction = new Dictionary(),
        priorityLevels = new Dictionary(),
        shipmentCompanies = new Dictionary(),
        paymentTypes = new Dictionary(),
        notificationTypes = new Dictionary(),
        notificationSection = new Dictionary(),
        notificationSectionCodes = new Dictionary(),
        notificationAvatar = new Dictionary(),
        notificationSectionClass = new Dictionary(),
        notificationSectionIconClass = new Dictionary(),
        themeStatus = new Dictionary(),
        fieldTypes = new Dictionary(),
        inputTypes = new Dictionary(),
        fieldTypesString = new Dictionary(),
        menuType = new Dictionary(),
        menuTypeCodes = new Dictionary(),
        menuItemType = new Dictionary(),
        menuItemTypeCodes = new Dictionary(),
        currentUserEmbed = {'emailAddresses': {},
                            'profilePicture': {},
                            'userCompanies': {"company": {}},
                            'enrolledDomains': {'domain': {}}},
        platformName = 'Merchi',
        platformCopyright = 2016,
        backendImgUri = backendUri + 'static/img/',
        platformIconWhite = backendImgUri + 'merchi-monster-white.png',
        platformIcon = backendImgUri + 'merchi-monster-blue.png',
        platformLogo = backendImgUri + 'merchi-master-colour-with-monster.png',
        defaultUserAvatar = backendImgUri + 'default-user-32px.jpg',
        loggedInUser = null,
        currentSession = null,
        jsonpHandlers = {},
        STATUS = {
            PROD: ['Init', 'Rejected', 'Bidding', 'Waiting Quote',
                   'Close Deadline', 'Assigned', 'Questioning', 'Commenced',
                   'Finish', 'Shipped'],
            DESIGN: ['not start', 'started', 'changes request',
                     'waiting for check', 'approved'],
            PAYMENT: ['Not Paid', 'Partially Paid', 'Fully Paid']
        },
        GSTrate = 0.1,
        DEFAULT_RIGHTS = [],
        subscriptionManager = new SubscriptionManager(),
        showUserAvatarArray =
            ['DRAFT_SENT', 'DRAFT_CHANGE_REQUEST', 'DRAFT_APPROVED',
             'DRAFT_COMMENT', 'JOB_COMMENT', 'PRODUCTION_COMMENT',
             'PRODUCTION_FILE_UPLOADED', 'PRODUCTION_FINISHED',
             'PRODUCTION_COMMENCED', 'QUOTE_APPROVED', 'SHIPMENT_UPDATE',
             'JOB_FILE_UPLOADED'],
        showDomainAvatarArray =
            ['NO_TYPE', 'DESIGNER_ASSIGNED', 'DESIGNER_CHANGED',
             'SEND_INVOICE', 'JOB_STALE', 'MANAGER_ASSIGNED', 'ORDER_RECEIVED',
             'CLIENT_CHANGED', 'PRODUCTION_CANCELLED', 'QUOTE_FAILED',
             'QUOTE_COMMENCED', 'QUOTE_EXPIRED', 'SUPPLIER_ASSIGNED',
             'READY_FOR_SHIPPING', 'SIGN_UP_CONFIRMATION', 'CRASH_EVENT',
             'MANAGER_SUMMARY', 'PASSWORD_RESET', 'MANAGER_REASSIGNED',
             'EMAIL_RESPONSE', 'SHIPMENT_EXPECTED_DATE_PAST',
             'DOMAIN_INVITATION'],
        showUserOrDomainAvatarArray =
            ['JOB_PAID', 'INVOICE_PAID', 'PAYMENT_ACCEPTED',
             'AUTOMATIC_JOB_RESPONSE', 'JOB_NOTIFICATION', 'JOB_REMINDER',
             'GENERAL_REMINDER', 'INVOICE_EMAIL_RESPONSE',
             'AUTOMATIC_INVOICE_RESPONSE', 'JOB_ADDED_TO_SHIPMENT',
             'JOB_REMOVED_FROM_SHIPMENT', 'ASSIGNMENT_REMOVED_FROM_SHIPMENT',
             'SHIPMENT_EXPECTED_DATE_PAST', 'ASSIGNMENT_ADDED_TO_SHIPMENT'],
        showDomainOrUserAvatarArray =
            ['SHIPMENT_DISPATCH_CLOSE', 'SHIPMENT_NOT_DISPATCHED',
             'SHIPMENT_EXPECTED_DATE_WARNING', 'SHIPMENT_EXPECTED_DATE_PAST'];

    /** Main() **/
    roles.add('public', 0);
    roles.add('admin', 1);
    roles.add('sales', 2);
    roles.add('designer', 3);
    roles.add('supplier', 4);
    roles.add('client', 5);
    roles.add('manager', 6);
    roles.add('accountant', 7);

    roles.each(function (key, value) {
        roleStrings.add(value, key);
    });

    roles.each(function (key, value) {
        allRoles.add(value);
    });

    roleCssClass.add(roles.get('public'), 'default');
    roleCssClass.add(roles.get('admin'), 'inverse');
    roleCssClass.add(roles.get('sales'), 'success');
    roleCssClass.add(roles.get('designer'), 'success');
    roleCssClass.add(roles.get('supplier'), 'warning');
    roleCssClass.add(roles.get('client'), 'danger');
    roleCssClass.add(roles.get('manager'), 'primary');
    roleCssClass.add(roles.get('accountant'), 'info');

    fieldTypes.add("TEXT_INPUT", 1);
    fieldTypes.add("SELECT", 2);
    fieldTypes.add("FILE_UPLOAD", 3);
    fieldTypes.add("TEXT_AREA", 4);
    fieldTypes.add("NUMBER_INPUT", 5);
    fieldTypes.add("CHECKBOX", 6);
    fieldTypes.add("RADIO", 7);
    fieldTypes.add("FIELD_INSTRUCTIONS", 8);
    fieldTypes.add("IMAGE_SELECT", 9);
    fieldTypes.add("COLOUR_PICKER", 10);
    fieldTypes.add("COLOUR_SELECT", 11);

    inputTypes.add(1, "text");
    inputTypes.add(2, "select");
    inputTypes.add(3, "file");
    inputTypes.add(4, "textarea");
    inputTypes.add(5, "number");
    inputTypes.add(6, "checkbox");
    inputTypes.add(7, "radio");
    inputTypes.add(8, "instructions");
    inputTypes.add(10, "text");

    jobStatusProduction.add("INIT", 0);
    jobStatusProduction.add("REJECTED", 1);
    jobStatusProduction.add("BIDDING", 2);
    jobStatusProduction.add("ASSIGN_SENT", 3);
    jobStatusProduction.add("ASSIGN_DEADLINE_REACHED", 4);
    jobStatusProduction.add("ASSIGN_COMPLETE", 5);
    jobStatusProduction.add("QUESTIONING", 6);
    jobStatusProduction.add("COMMENCED", 7);
    jobStatusProduction.add("FINISHED", 8);
    jobStatusProduction.add("SHIPPED", 9);

    fieldTypesString.add(1, "TEXT_INPUT");
    fieldTypesString.add(2, "SELECT");

    themeStatus = new Dictionary();
    themeStatus.add("NOT_VALID", 1);
    themeStatus.add("VALID_BUT_NOT_UPDATED", 2);
    themeStatus.add("VALID_AND_UPDATED", 3);

    shipmentCompanies.add(0, 'DHL');
    shipmentCompanies.add(1, 'UPS');
    shipmentCompanies.add(2, 'EMS');
    shipmentCompanies.add(3, 'FedEx');
    shipmentCompanies.add(4, 'Australia Post');
    shipmentCompanies.add(5, 'StarTrack');
    shipmentCompanies.add(6, 'Toll');
    shipmentCompanies.add(7, 'TNT');
    shipmentCompanies.add(8, 'Custom Track Link');

    paymentTypes.add(1, 'Online');
    paymentTypes.add(2, 'PayPal');
    paymentTypes.add(3, 'Bank Transfer');
    paymentTypes.add(4, 'Cash');
    paymentTypes.add(5, 'Cheque');
    paymentTypes.add(6, 'Phone');
    paymentTypes.add(7, 'Credit Card');

    notificationTypes.add("NO_TYPE", 0);
    notificationTypes.add("DRAFT_SENT", 1);
    notificationTypes.add("DRAFT_CHANGE_REQUEST", 2);
    notificationTypes.add("DRAFT_APPROVED", 3);
    notificationTypes.add("DESIGNER_ASSIGNED", 4);
    notificationTypes.add("DESIGNER_CHANGED", 5);
    notificationTypes.add("DRAFT_COMMENT", 6);
    notificationTypes.add("JOB_PAID", 7);
    notificationTypes.add("INVOICE_PAID", 8);
    notificationTypes.add("PAYMENT_ACCEPTED", 9);
    notificationTypes.add("SEND_INVOICE", 10);
    notificationTypes.add("JOB_COMMENT", 11);
    notificationTypes.add("PRODUCTION_COMMENT", 12);
    notificationTypes.add("JOB_STALE", 13);
    notificationTypes.add("MANAGER_ASSIGNED", 14);
    notificationTypes.add("ORDER_RECEIVED", 15);
    notificationTypes.add("CLIENT_CHANGED", 16);
    notificationTypes.add("PRODUCTION_FILE_UPLOADED", 17);
    notificationTypes.add("PRODUCTION_CANCELLED", 18);
    notificationTypes.add("PRODUCTION_FINISHED", 19);
    notificationTypes.add("PRODUCTION_COMMENCED", 20);
    notificationTypes.add("QUOTE_APPROVED", 21);
    notificationTypes.add("QUOTE_REFUSED", 22);
    notificationTypes.add("QUOTE_SUBMITTED", 23);
    notificationTypes.add("QUOTE_FAILED", 24);
    notificationTypes.add("QUOTE_COMMENCED", 25);
    notificationTypes.add("QUOTE_EXPIRED", 26);
    notificationTypes.add("SUPPLIER_ASSIGNED", 27);
    notificationTypes.add("SUPPLIER_REFUSED", 28);
    notificationTypes.add("READY_FOR_SHIPPING", 29);
    notificationTypes.add("SHIPMENT_UPDATE", 30);
    notificationTypes.add("SIGN_UP_CONFIRMATION", 31);
    notificationTypes.add("AUTOMATIC_JOB_RESPONSE", 32);
    notificationTypes.add("CRASH_EVENT", 33);
    notificationTypes.add("MANAGER_SUMMARY", 34);
    notificationTypes.add("PASSWORD_RESET", 35);
    notificationTypes.add("MANAGER_REASSIGNED", 36);
    notificationTypes.add("EMAIL_RESPONSE", 37);
    notificationTypes.add("JOB_NOTIFICATION", 38);
    notificationTypes.add("JOB_REMINDER", 39);
    notificationTypes.add("GENERAL_REMINDER", 40);
    notificationTypes.add("INVOICE_EMAIL_RESPONSE", 41);
    notificationTypes.add("AUTOMATIC_INVOICE_RESPONSE", 42);
    notificationTypes.add("SHIPMENT_DISPATCH_CLOSE", 43);
    notificationTypes.add("SHIPMENT_NOT_DISPATCHED", 44);
    notificationTypes.add("SHIPMENT_EXPECTED_DATE_WARNING", 45);
    notificationTypes.add("JOB_ADDED_TO_SHIPMENT", 46);
    notificationTypes.add("JOB_REMOVED_FROM_SHIPMENT", 47);
    notificationTypes.add("ASSIGNMENT_REMOVED_FROM_SHIPMENT", 48);
    notificationTypes.add("ASSIGNMENT_ADDED_TO_SHIPMENT", 49);
    notificationTypes.add("SHIPMENT_EXPECTED_DATE_PAST", 50);
    notificationTypes.add("JOB_FILE_UPLOADED", 51);
    notificationTypes.add("DOMAIN_INVITATION", 52);

    function makeNotificationAvatarArray(listOfAvatarKeys) {
        var avatarIdArray = [],
            i;
        for (i = 0; i < listOfAvatarKeys.length; i++) {
            avatarIdArray.push(notificationTypes.get(listOfAvatarKeys[i]));
        }
        return avatarIdArray;
    }

    notificationAvatar.add('SHOW_USER_AVATAR',
                           makeNotificationAvatarArray(showUserAvatarArray));
    notificationAvatar.add('SHOW_DOMAIN_AVATAR',
                           makeNotificationAvatarArray(showDomainAvatarArray));
    notificationAvatar.add('SHOW_USER_OR_DOMAIN_AVATAR',
                           makeNotificationAvatarArray(
                               showUserOrDomainAvatarArray));
    notificationAvatar.add('SHOW_DOMAIN_OR_USER_AVATAR',
                           makeNotificationAvatarArray(
                               showDomainOrUserAvatarArray));

    function isAvatarTypeInNotificationAvatar(avatarTypeString, noteType) {
        var i, avatarType = notificationAvatar.get(avatarTypeString);
        return any(avatarType, function (type) { return type === noteType; });
    }

    notificationSection.add(0, "system");
    notificationSection.add(1, "user");
    notificationSection.add(2, "info");
    notificationSection.add(3, "design");
    notificationSection.add(4, "production");
    notificationSection.add(5, "invoicing");
    notificationSection.add(6, "shipping");
    notificationSection.add(7, "invoice");
    notificationSection.add(8, "notifications");
    notificationSection.add(9, "reminder");

    notificationSectionClass.add(0, "default");
    notificationSectionClass.add(1, "danger");
    notificationSectionClass.add(2, "inverse");
    notificationSectionClass.add(3, "success");
    notificationSectionClass.add(4, "warning");
    notificationSectionClass.add(5, "primary");
    notificationSectionClass.add(6, "info");
    notificationSectionClass.add(7, "primary");
    notificationSectionClass.add(8, "inverse");
    notificationSectionClass.add(9, "default");

    notificationSectionIconClass.add(0, "fa fa-server");
    notificationSectionIconClass.add(1, "fa fa-user");
    notificationSectionIconClass.add(2, "fa fa-info");
    notificationSectionIconClass.add(3, "fa fa-paint-brush");
    notificationSectionIconClass.add(4, "fa fa-wrench");
    notificationSectionIconClass.add(5, "fa fa-file-pdf-o");
    notificationSectionIconClass.add(6, "fa fa-truck");
    notificationSectionIconClass.add(7, "fa fa-file-pdf-o");
    notificationSectionIconClass.add(8, "fa fa-inbox");
    notificationSectionIconClass.add(9, "fa fa-lightbulb-o");

    notificationSection.each(function (key, value) {
        notificationSectionCodes.add(value, parseInt(key, 10));
    });

    function notificationRecieverIsCurrentUserFilter(currentUser,
                                                     notificationsArray) {
        var notifications = Boolean(notificationsArray) ?
                notificationsArray : [],
            updatedArray = [],
            i;
        for (i = 0; i < notifications.length; i++) {
            if (Boolean(notifications[i].recipient()) &&
                notifications[i].recipient().id() === currentUser.id()) {
                updatedArray.push(notifications[i]);
            }
        }
        return updatedArray;
    }

    function notificationsFilter(notificationsArray, filterObjectArray) {
        /* Takes an array of notifications and a filter, loops over
           the notifications array and checks to see
           if any of the filters in the filter object apply.
        */
        var notifications = Boolean(notificationsArray) ?
                notificationsArray : [],
            updatedArray = [],
            filterObject,
            key,
            i;

        function checkNotifications(attributeString, attributeValue) {
            var i, notification;
            for (i = 0; i < notifications.length; i++) {
                notification = notifications[i].
                    checkKeyValue(attributeString, attributeValue);
                if (Boolean(notification)) {
                    updatedArray.push(notification);
                }
            }
        }

        for (i = 0; i < filterObjectArray.length; i++) {
            filterObject = filterObjectArray[i];
            for (key in filterObject) {
                if (Object.prototype.hasOwnProperty.call(filterObject, key)) {
                    checkNotifications(key, filterObject[key]);
                }
            }
        }
        return updatedArray;
    }

    priorityLevels.add("URGENT_JOB_PRIORITY", 1);
    priorityLevels.add("HIGH_JOB_PRIORITY", 2);
    priorityLevels.add("MEDIUM_JOB_PRIORITY", 3);
    priorityLevels.add("LOW_JOB_PRIORITY", 4);

    rights.add('canAccess', 1);
    rights.add('canEdit', 2);
    rights.add('canDelete', 3);


    eventTypes.add('POST', 0);
    eventTypes.add('PATCH', 1);
    eventTypes.add('DELETE', 2);

    itemTypes.add('custom', 0);
    itemTypes.add('shipping', 1);
    itemTypes.add('tax', 2);

    menuType.add(0, 'Main menu');
    menuType.add(1, 'Footer menu');
    menuType.add(2, 'Other menu');

    menuType.each(function (key, value) {
        menuTypeCodes.add(value, parseInt(key, 10));
    });

    menuItemType.add(0, 'Redirect');
    menuItemType.add(1, 'Internal');

    menuItemType.each(function (key, value) {
        menuItemTypeCodes.add(value, parseInt(key, 10));
    });

    DEFAULT_RIGHTS = [rights.get("canAccess"),
                      rights.get("canEdit"),
                      rights.get("canDelete")];
    /** Key functions, fromJson, Request **/
    function forEachProperty(obj, procedure) {
        obj._properties.each(function (property) {
            // elem in _propertiesSet is array
            // 0 is name, 1 is type
            procedure(property[0], property[1]);
        });
    }

    function fromJson(model, json) {
        forEachProperty(model, function (propName, Type) {
            try {
                var received = json[propName],
                    parsed;

                if (!Type || typeof received === 'number') {
                    // Prop is untyped or only id received
                    model[propName](received);
                } else {
                    // Prop is typed and other thing rather than
                    // single id received
                    if (received instanceof Array) {
                        if (received.length === 0) {
                            return;
                        }
                        if (received[0] instanceof Object) {
                            // response has embed obj
                            parsed = fromJsonList(new Type(), received);
                        } else {
                            // response is id array
                            parsed = received;
                        }
                    } else {
                        // Embed Object received
                        parsed = fromJson(new Type(), received);
                    }
                    model[propName](parsed);
                }
            } catch (ignore) {
            }
        });
        model.rights = json.rights;
        return model;
    }

    function fromJsonList(obj, json) {
        var result = [],
            list,
            i,
            single;

        // When request plural eg /users, it gives typed json list
        // But when request embed data, annonymous json list returned
        if (json.constructor === Array) {
            // Embed data process
            list = json;
            for (i = 0; i < list.length; ++i) {
                single = new obj.constructor();
                result.push(fromJson(single, list[i]));
            }
            return result;
        }

        // Plural request eg /users
        list = json[obj.json];

        for (i = 0; i < list.length; ++i) {
            single = new obj.single();
            result.push(fromJson(single, list[i][single.json]));
        }

        // Append meta data for pagination,
        // workaroundbackward compatibility
        result.meta = {
            available: json.available,
            count: json.count,
            canCreate: json.canCreate
        };

        return result;
    }

    function toJsonList(objs) {
        var result = [],
            i,
            obj,
            obj_dict;

        for (i = 0; i < objs.length; i++) {
            obj = objs[i];
            obj_dict = toJson(obj);
            result.push(obj_dict);
        }
        return result;
    }

    function toJson(model) {
        var json = {}, value, dict;
        forEachProperty(model, function (propName, Type) {

            var propNameCamel =
                propName.replace(/_([a-z])/g,
                    function (g) { return g[1].toUpperCase(); });
            try {
                value = model[propName]();
                if (value !== null && (!Type || typeof value === 'number')) {
                    // if the value is default value skip from to json
                    // Prop is untyped or only id received
                    json[propNameCamel] = value;
                } else if (value !== null) {
                    // Prop is typed and other thing rather than
                    // single id received
                    if (value instanceof Array) {
                        if (value.length > 0) {
                            if (value[0] instanceof Object) {
                                // value is a array of objs
                                dict = toJsonList(value);
                            } else {
                                // value is a array of id
                                dict = value;
                            }
                        }
                    } else {
                        // Embed Object received
                        dict = toJson(value);
                    }
                    json[propNameCamel] = dict;
                }
            } catch (ignore) {
            }
        });
        json.rights = model.rights;
        return json;
    }


    function serialise(obj, existing, prefix, files) {
        var result = new Dictionary(),
            index;
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
                result.add(name, value);
            }
        }
        if (Boolean(obj.fileData)) {
            index = files.length;
            files.push(obj.fileData);
            appendData('fileDataIndex', index);
        }
        forEachProperty(obj, function (property, Type) {
            var value = obj[property](),
                remoteCount,
                i,
                innerPrefix,
                nested;
            if (!isUndefined(Type) && Boolean(Type)) {
                // serialise relationship
                if (value instanceof Array) {
                    // multiple remove entities
                    remoteCount = value.length;
                    appendData(property + '-count', remoteCount);
                    for (i = 0; i < remoteCount; ++i) {
                        innerPrefix = property + '-' + i;
                        if (Boolean(prefix)) {
                            innerPrefix = prefix + '-' + innerPrefix;
                        }
                        nested = serialise(value[i], result, innerPrefix,
                                           files);
                        result = nested[0];
                        files = nested[1];
                    }
                } else if (Boolean(value)) {
                    // one remote entity
                    appendData(property + '-count', 1);
                    innerPrefix = property + '-0';
                    if (Boolean(prefix)) {
                        innerPrefix = prefix + '-' + innerPrefix;
                    }
                    nested = serialise(value, result, innerPrefix, files);
                    result = nested[0];
                    files = nested[1];
                }
            } else {
                // serialise scalar
                appendData(property, value);
            }
        });
        return [result, files];
    }

    function addPropertyTo(obj, propertyName, Type) {
        if (!Object.prototype.hasOwnProperty.call(obj, '_properties')) {
            obj._properties = new Set();
        }
        var hiddenProperty = '_' + propertyName;
        if (isUndefined(Type)) {
            Type = null;
        }

        // So Unitix Model has inbult _properties which is a Set
        // _properties indicate the key(propertyName) and type()
        // But a real property is in  Model._+propertyName
        // and its accessor is Model.propertyName(value)
        obj._properties.add([propertyName, Type]);
        obj[propertyName] = function (value) {
            if (isUndefined(value)) {
                return obj[hiddenProperty];
            }
            obj[hiddenProperty] = value;
            return obj;
        };
    }

    function Request() {

        var server = backendUri,
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


        this.ajaxSupported = function () {
            return this.crossDomainAjaxSupported() ||
                Boolean(window.XMLHttpRequest);
        };

        this.crossDomainAjaxSupported = function () {
            if (Boolean(window.XMLHttpRequest)) {
                var xhr = new XMLHttpRequest();
                if (!isUndefined(xhr)) {
                    return true;
                }
            }
            return false;
        };

        this.p2pSupported = function () {
            return false;
        };

        this.usableMethod = function () {
            var methodName = this.method().toUpperCase();
            if (this.crossDomainAjaxSupported()) {
                return methodName;
            }

            if (methodName === 'GET') {
                return 'GET';
            }
            return 'POST';
        };

        this.url = function () {
            return this.server() + this.path();
        };

        this.path = function () {
            var url = this.version();
            url += this.resource();
            if (!this.crossDomainAjaxSupported() &&
                    this.method().toUpperCase() !== 'GET' &&
                    this.method().toUpperCase() !== 'POST') {
                this.query().add('method', this.method());
            }
            if (Boolean(currentSession) && Boolean(currentSession.token())) {
                this.query().add('session_token', currentSession.token());
            }
            if (this.query().count() > 0) {
                url += '?' + this.query().toUriEncoding();
            }
            return url;
        };

        this.jsonpUrl = function (handlerName) {
            var url = '';
            url += this.server();
            url += this.version();
            url += '/jsonp/?method=' + encodeURIComponent(this.method());
            url += '&resource=' + encodeURIComponent(this.resource().
                substring(1));
            url += '&jsonp=' + encodeURIComponent(handlerName);
            if (Boolean(currentSession) && Boolean(currentSession.token())) {
                this.query().add('session_token', currentSession.token());
            }
            this.query().each(function (name, value) {
                url += '&' + name + '=' + encodeURIComponent(value);
            });
            url += this.data().toUriEncoded();
            return url;
        };

        this.send = function () {
            if (this.crossDomainAjaxSupported()) {
                this.sendXMLHttpRequest();
            } else {
                this.sendJSONP();
            }
            return this;
        };

        this.sendJSONP = function () {
            var scriptTag = document.createElement('SCRIPT'),
                rand = 'h' + (Math.random() + 1).toString(36).substr(2, 8),
                handlerName = 'MERCHI.jsonpHandlers.' + rand,
                self = this;
            jsonpHandlers[rand] = function (status, response) {
                delete jsonpHandlers[handlerName];
                document.body.removeChild(scriptTag);
                self.responseHandler()(status, JSON.stringify(response));
            };
            scriptTag.setAttribute('type', 'text/javascript');
            scriptTag.setAttribute('src', this.jsonpUrl(handlerName));
            document.body.appendChild(scriptTag);
        };

        this.sendXMLHttpRequest = function () {
            var self = this,
                transport = new XMLHttpRequest(),
                allData;
            function wrapLoad() {
                self.responseHandler()(transport.status,
                        transport.responseText);
            }
            function wrapError() {
                self.errorHandler()();
            }
            transport.addEventListener('load', wrapLoad);
            transport.addEventListener('error', wrapError);
            if (this.username() !== null) {
                transport.open(this.usableMethod(), this.url(), true,
                    this.username(), this.password());
                transport.setRequestHeader('Authorization', 'Basic ' +
                    btoa(this.username() + ':' + this.password()));
            } else {
                transport.open(this.usableMethod(), this.url(), true);
            }
            transport.withCredentials = true;
            if (this.contentType() !== null) {
                transport.setRequestHeader('Content-type', this.contentType());
            }
            allData = this.data();
            allData.merge(this.files());
            transport.send(allData.toFormData());
        };

    }

    function recoverOne(model, id, success, error) {
        var request = new Request();
        request.resource("/unarchive/" + model + '/' + id + '/').method('POST');
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                success();
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not recover the entity'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function deleteOne(resource, success, error) {
        var request = new Request();
        request.resource(resource + '/').method('DELETE');
        function handleResponse(status, body) {
            var result = '';
            if (status === 204) {
                success();
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not delete the entity'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }


    function getOne(resource, id, success, error, embed, includeArchived) {
        var request = new Request();
        request.resource(resource + '/' + id + '/').method('GET');

        if (embed && embed.constructor === Object) {
            embed = JSON.stringify(embed);
            request.query().add('embed', embed);
        }

        if (includeArchived) {
            request.query().add("include_archived", true);
        }

        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    error({message: 'problem getting response from server'});
                    return;
                }
                success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (err) {
                    result = {message: 'could not get the entity'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);

        request.send();
    }

    function create(options) {
        var request = new Request(),
            embed,
            message;
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
        function handleResponse(status, body) {
            var result = '';
            if (status === 201) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    message = 'problem getting response from server';
                    options.error({message: message});
                    return;
                }
                options.success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (err) {
                    result = {message: 'could not create the resource'};
                }
                options.error(result);
            }
        }
        function handleError() {
            options.error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function patchOne(options) {
        var request = new Request(),
            id = options.id;
        options.resource = options.resource || '';
        options.id = options.id || '';
        options.data = options.data || {};
        options.success = options.success || id;
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
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    var message = 'problem getting response from server';
                    options.error({message: message});
                    return;
                }
                options.success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (err) {
                    result = {message: 'could not edit the entity'};
                }
                options.error(result);
            }
        }
        function handleError() {
            options.error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);

        request.send();
    }


    function getList(resource, success, error, parameters, withUpdates) {

        var request = new Request();

        function getListResponseHandler(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    error({message: 'problem getting response from server'});
                    return;
                }
                success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (err) {
                    result = {message: 'could not get the list'};
                }
                error(result);
            }
        }

        function handleError() {
            error({message: 'could not connect to server'});
        }

        request.resource(resource + '/').method('GET');
        request.responseHandler(getListResponseHandler)
            .errorHandler(handleError);

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
        if (parameters.embed && parameters.embed.constructor === Object) {
            request.query().add('embed', JSON.stringify(parameters.embed));
        }
        if (notEmpty(parameters.state)) {
            request.query().add('state', parameters.state);
        }
        if (notEmpty(parameters.categoryId)) {
            request.query().add('category_id', parameters.categoryId);
        }
        if (notEmpty(parameters.inDomain)) {
            request.query().add('in_domain', parameters.inDomain);
        }
        if (parameters.inDomainRoles) {
            request.query().add('in_domain_roles',
                                JSON.stringify(parameters.inDomainRoles));
        }
        if (parameters.managedDomainsOnly) {
            request.query().add('managed_domains_only',
                                JSON.stringify(parameters.managedDomainsOnly));
        }
        if (notEmpty(parameters.dateFrom)) {
            request.query().add('date_from', parameters.dateFrom);
        }
        if (notEmpty(parameters.dateTo)) {
            request.query().add('date_to', parameters.dateTo);
        }
        if (notEmpty(parameters.relatedJob)) {
            request.query().add('related_job', parameters.relatedJob);
        }
        if (notEmpty(parameters.jobNotifiable)) {
            request.query().add('job_notifiable',
                parameters.jobNotifiable);
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
        if (notEmpty(parameters.queryString)) {
            request.query().add('query_string',
                                parameters.queryString);
        }
        if (notEmpty(parameters.companyId)) {
            request.query().add('company_id', parameters.companyId);
        }
        if (notEmpty(parameters.section)) {
            request.query().add('section', parameters.section);
        }
        if (notEmpty(parameters.senderRole)) {
            request.query().add('senderRole', parameters.section);
        }
        if (notEmpty(parameters.noFilter)) {
            request.query().add('noFilter', parameters.noFilter);
        }
        if (notEmpty(parameters.isOrder)) {
            request.query().add('is_order', parameters.isOrder);
        }

        request.send();

        if (withUpdates) {
            return subscriptionManager.subscribe(withUpdates,
                                                 request.path(),
                                                 "GET",
                getListResponseHandler);
        }
        return null;
    }

    /** User **/
    function PhoneNumber() {
        this.resource = '/phone_numbers';
        this.json = 'phoneNumber';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'number');
        addPropertyTo(this, 'code');
        addPropertyTo(this, 'localFormatNumber');
        addPropertyTo(this, 'internationalFormatNumber');

    }

    function EmailAddress() {
        this.resource = '/email_addresses';
        this.json = 'emailAddress';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'emailAddress');
    }

    function Address() {
        this.resource = '/addresses';
        this.json = 'address';

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
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };

        this.fullAddressString = function () {
            var self = this,
                addressString = '';
            addressString = self.lineOne();
            addressString += " " + self.lineTwo() + ", ";
            addressString += self.city() + " ";
            addressString += self.state() + " ";
            addressString += self.postcode() + " ";
            addressString += self.country();
            return addressString;
        };

        this.stateAndCountryString = function () {
            var self = this,
                addressString = '';
            addressString += self.state() + " ";
            addressString += self.country();
            return addressString;
        };
    }

    function Bank() {
        this.resource = '/banks';
        this.json = 'bank';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'bankName');
        addPropertyTo(this, 'accountNumber');
        addPropertyTo(this, 'bsb');
        addPropertyTo(this, 'swiftCode');
        addPropertyTo(this, 'iban');
        addPropertyTo(this, 'bankCode');
        addPropertyTo(this, 'bankAddress', Address);
        addPropertyTo(this, 'company', Companies);
    }

    function MerchiFile() {
        this.resource = '/files';
        this.json = 'file';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'size');
        addPropertyTo(this, 'mimetype');
        addPropertyTo(this, 'viewUrl');
        addPropertyTo(this, 'downloadUrl');
        addPropertyTo(this, 'creationDate');

        this.get = function (success, error, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error, embed);
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
    }

    function MenuItem() {
        this.resource = '/menu_items';
        this.json = 'menuItem';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'linkType');
        addPropertyTo(this, 'linkUri');
        addPropertyTo(this, 'position');

        this.url = function (domain) {
            if (domain && this.linkType() === 1) {
                return 'http://' + domain.subDomain() + '.' + window.server +
                   '/' + this.linkUri();
            }
            return this.linkUri();
        };
    }

    function Menu() {
        this.resource = '/menus';
        this.json = 'menu';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'menuHandle');
        addPropertyTo(this, 'menuType');
        addPropertyTo(this, 'menuItems', MenuItem);

        this.get = function (success, error, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error, embed);
        };
    }

    function Domain() {
        this.resource = '/domains';
        this.json = 'domain';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'domain');
        addPropertyTo(this, 'subDomain');
        addPropertyTo(this, 'theme');
        addPropertyTo(this, 'logoUrl');
        addPropertyTo(this, 'smsName');
        addPropertyTo(this, 'emailDomain');
        addPropertyTo(this, 'conversionTrackingCode');
        addPropertyTo(this, 'logo', MerchiFile);
        addPropertyTo(this, 'company', Company);
        addPropertyTo(this, 'menus', Menu);
        addPropertyTo(this, 'showDomainPublicly');
        addPropertyTo(this, 'enableNotifications');
        addPropertyTo(this, 'enableEmailNotifications');
        addPropertyTo(this, 'enableSmsNotifications');
        addPropertyTo(this, 'activeTheme', Theme);
        addPropertyTo(this, 'themes', Theme);

        this.create = function (success, error, embed, as_domain) {
            var data = new Dictionary(),
                self = this;
            data.add('domain', this.domain());
            data.add('theme', this.theme());
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    files: data[1],
                    as_domain: as_domain,
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.get = function (success, error, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error, embed);
        };

        this.getUsers = function (success, error, offset, limit,
                                  q, embed, tab) {
            var self = this,
                users = new Users();

            function handleResponse(result) {
                success(fromJsonList(users, result));
            }
            getList(users.resource, handleResponse, error,
                    {inDomain: self.id(), tab: tab, offset: offset,
                     limit: limit, q: q, embed: embed});
        };

        this.getManagers = function (success, error, offset, limit, embed) {
            var self = this;
            self.getUsers(success, error, offset, limit,
                          null, embed, "manager");
        };

        this.getUsersWithRoles = function (success, error, roles, offset,
                                           limit, embed) {
            var self = this,
                users = new Users();

            function handleResponse(result) {
                success(fromJsonList(users, result));
            }

            getList(users.resource, handleResponse, error,
                    {inDomain: self.id(), inDomainRoles: roles,
                     offset: offset, limit: limit, embed: embed});
        };

        this.patch = function (success, error, data, embed, as_domain) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      as_domain: as_domain,
                      error: error,
                      data: data,
                      embed: embed});
        };

        this.update = function (success, error, embed) {
            this.patch(success, error, serialise(this)[0], embed);
        };

        this.mainMenu = function () {
           var menus = this.menus(),
               i = 0;
           if (menus === undefined) {
               return null;
           }
           for (i = 0; i < menus.length; ++i) {
               if (menus[i].menuType() === 0) {
                   return menus[i];
               }
           }
           return null;
        };
    }

    function Theme() {
        this.resource = '/themes';
        this.json = 'theme';


        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'description');
        addPropertyTo(this, 'public');
        addPropertyTo(this, 'lastUpdated');
        addPropertyTo(this, 'featureImage', MerchiFile);
        addPropertyTo(this, 'cssImageFiles', MerchiFile);
        addPropertyTo(this, 'mainCssStatus');
        addPropertyTo(this, 'mainCssFile', MerchiFile);
        addPropertyTo(this, 'mainCssTemplate', MerchiFile);
        addPropertyTo(this, 'emailCssStatus');
        addPropertyTo(this, 'emailCssFile', MerchiFile);
        addPropertyTo(this, 'emailCssTemplate', MerchiFile);
        addPropertyTo(this, 'author', User);
        addPropertyTo(this, 'domain', Domain);

        this.get = function (success, error, embed) {
            var self = this;

            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }

            getOne(this.resource, this.id(),
                handleResponse, error,
                embed);
        };

        this.canBeActivated = function () {
            var validStatus = themeStatus.get("VALID_BUT_NOT_UPDATED");
            return this.mainCssStatus() >= validStatus &&
                this.emailCssStatus() >= validStatus;
        };
    }

    function User() {
        this.resource = '/users';
        this.json = 'user';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'password');
        addPropertyTo(this, 'resetToken');
        addPropertyTo(this, 'created');
        addPropertyTo(this, 'timezone');
        addPropertyTo(this, 'isSuperUser');
        addPropertyTo(this, 'prefered_language');
        addPropertyTo(this, 'enableCrashReports');
        addPropertyTo(this, 'enableClientEmails');
        addPropertyTo(this, 'phoneNumbers', PhoneNumber);
        addPropertyTo(this, 'emailAddresses', EmailAddress);
        addPropertyTo(this, 'addresses', Address);
        addPropertyTo(this, 'userCompanies', UserCompany);
        addPropertyTo(this, 'enrolledDomains', EnrolledDomain);
        addPropertyTo(this, 'profilePicture', MerchiFile);
        /* products that supplier can produce */
        addPropertyTo(this, 'products', Product);

        this.create = function (success, error, embed, as_domain) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: as_domain,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.patch = function (success, error, data, embed, as_domain) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      as_domain: as_domain,
                      success: handleResponse,
                      error: error,
                      data: data,
                      embed: embed});
        };

        this.roleInDomain = function (domainId) {
            var i, enrolledDomains = this.enrolledDomains();
            for (i = 0; i < enrolledDomains.length; i++) {
                if (parseInt(enrolledDomains[i].domain().id(), 10) === domainId) {
                    return enrolledDomains[i].role();
                }
            }
            return roles.get("public");
        };

        this.hasAuthority = function (domainId, roles) {
            var i, domainRole = this.roleInDomain(domainId);
            if (this.isSuperUser()) {
                return true;
            }
            for (i = 0; i < roles.length; i++) {
                if (roles[i] === domainRole) {
                    return true;
                }
            }
            return false;
        };

        this.isAdminOrManager = function (domainId) {
            var self = this,
                managerRole = roles.get('manager'),
                adminRole = roles.get('admin');
            return self.hasAuthority(domainId, [managerRole, adminRole]);
        };

        this.allRoles = function () {
            var rolesSet = Set(), i,
                enrolledDomains = this.enrolledDomains();
            if (this.isSuperUser()) {
                return allRoles;
            }
            for (i = 0; i < enrolledDomains.length; i++) {
                rolesSet.add(enrolledDomains[i].role());
            }
            rolesSet.add(roles.get("public"));
            return rolesSet;
        };

        this.hasRole = function (roles, combineFunction) {
            var userRoles = this.allRoles(), i,
                isRoleInJudgementResult = [];
            if (!combineFunction) {
                combineFunction = any;
            }
            for (i = 0; i < roles.length; i++) {
                isRoleInJudgementResult.append(userRoles.has(roles[i]));
            }
            return combineFunction(isRoleInJudgementResult);
        };

        this.update = function (success, error, embed) {
            this.patch(success, error, serialise(this)[0], embed);
        };

        this.get = function (success, error, embed) {
            var self = this;

            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }

            getOne(this.resource, this.id(),
                handleResponse, error,
                embed);
        };

        this.inDomain = function (domainId) {
            var i, user_domains = this.domains();
            for (i = 0; i < user_domains.length; i += 1) {
                if (user_domains[i].id() === parseInt(domainId, 10)) {
                    return true;
                }
            }
            return false;
        };

        this.userLocalTime = function (time) {
            return moment(time).tz(this.timezone()).toDate();
        };

        this.userLocalTimeUnix = function (time) {
            return moment(time).tz(this.timezone()).unix();
        };

        this.profilePictureUrl = function (size) {
            var email = this.emailAddresses() ?
                        this.emailAddresses()[0].emailAddress().toLowerCase() :
                        'this address does not exist. md5 collision unlikely';
            size = size || 50;
            if (this.profilePicture()) {
                return String(this.profilePicture().viewUrl());
            }
            return 'https://www.gravatar.com/avatar/' +
                MD5.md5(email) +
                '?d=mm&s=' + size;
        };

        this.primaryEmailAddress = function () {
            if (Boolean(this.emailAddresses()) && Boolean(this.emailAddresses()[0])) {
                return this.emailAddresses()[0].emailAddress();
            }
            return null;
        };

        this.primaryPhoneNumber = function () {
            if (Boolean(this.phoneNumbers()) && Boolean(this.phoneNumbers()[0])) {
                return this.phoneNumbers()[0].internationalFormatNumber();
            }
            return null;
        };

        this.primaryCompany = function () {
            if (Boolean(this.userCompanies()) && Boolean(this.userCompanies()[0])) {
                return this.userCompanies()[0].company();
            }
            return null;
        };

        this.primaryAddress = function () {
            var self = this;
            if (Boolean(self.addresses()) && Boolean(self.addresses()[0])) {
                return self.addresses()[0];
            }
            return null;
        };

        this.primaryAddressString = function () {
            var self = this;

            if (Boolean(self.primaryAddress())) {
                return self.primaryAddress().fullAddressString();
            }
            return 'Address not shared.';
        };
    }

    function EnrolledDomain() {
        this.resource = '/enrolled_domains';
        this.json = 'enrolledDomain';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'role');
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'domain', Domain);

        this.get = function (success, error) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };
    }

    function UserCompany() {
        this.resource = '/user_companies';
        this.json = 'userCompany';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'isAdmin');
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'company', Company);
    }

    function Session() {
        this.resource = '/sessions';
        this.json = 'session';

        addPropertyTo(this, 'address');
        addPropertyTo(this, 'expires');
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'token');

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
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.token(), handleResponse, error, embed);
        };

        this.remove = function (success, error) {
            deleteOne(this.resource, success, error);
        };

    }

    function getCookie(name) {
        var searchPrefix = name + '=',
            cookies = document.cookie.split(';'),
            i,
            cookie;
        for (i = 0; i < cookies.length; ++i) {
            cookie = cookies[i];
            cookie = cookie.replace(/^\s*/, '');
            if (cookie.indexOf(searchPrefix) === 0) {
                return cookie.substring(searchPrefix.length, cookie.length);
            }
        }
        throw 'no such cookie present';
    }


    function setSessionCookie(name, value) {
        document.cookie = name + '=' + value + '; path=/';
    }

    function logout() {
        if (Boolean(currentSession)) {
            currentSession.remove(id, id);
            loggedInUser = null;
            currentSession = null;
        }
    }

    /** Single Models **/

    function CountryTax() {
        this.resource = '/country_taxes';
        this.json = 'countryTax';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'country');
        addPropertyTo(this, 'taxName');
        addPropertyTo(this, 'taxPercent');

        this.create = function (success, error, embed, as_domain) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: as_domain,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.get = function (success, error) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };

        this.wrapedRepresentation = function () {
            var representation = this.taxName();
            if (Boolean(this.country())) {
                representation += " (" + this.country() + ")";
            }
            return representation;
        };
    }

    function Company() {
        this.resource = '/companies';
        this.json = 'company';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'website');
        addPropertyTo(this, 'logo', MerchiFile);
        addPropertyTo(this, 'defaultCurrency');
        addPropertyTo(this, 'defaultTaxType', CountryTax);
        addPropertyTo(this, 'paypalAccount');
        addPropertyTo(this, 'paypalPassword');
        addPropertyTo(this, 'paypalSignature');
        addPropertyTo(this, 'isPaypalValid');
        addPropertyTo(this, 'stripePublishableKey');
        addPropertyTo(this, 'stripeApiKey');
        addPropertyTo(this, 'isStripeValid');
        addPropertyTo(this, 'acceptStripe');
        addPropertyTo(this, 'acceptPaypal');
        addPropertyTo(this, 'acceptBankTransfer');
        addPropertyTo(this, 'acceptPhonePayment');
        addPropertyTo(this, 'temporaryCreated');
        addPropertyTo(this, 'userCompanies', UserCompany);
        addPropertyTo(this, 'phoneNumbers', PhoneNumber);
        addPropertyTo(this, 'paymentPhoneNumbers', PhoneNumber);
        addPropertyTo(this, 'emailAddresses', EmailAddress);
        addPropertyTo(this, 'addresses', Address);
        addPropertyTo(this, 'banks', Bank);

        this.create = function (success, error, embed, as_domain) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: as_domain,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.get = function (success, error, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error,
                   embed);
        };

        this.patch = function (success, error, embed) {
            var self = this,
                data = serialise(this)[0];
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      error: error,
                      data: data,
                      embed: embed});
        };

        this.primaryAddress = function () {
            if (Boolean(this.addresses()) && Boolean(this.addresses()[0])) {
                return this.addresses()[0];
            }
            return null;
        };

        this.stateAndCountryString = function () {
            var self = this;

            if (Boolean(self.primaryAddress())) {
                return self.primaryAddress().stateAndCountryString();
            }
            return 'Address not shared.';
        };

        this.primaryAddressString = function () {
            var self = this;

            if (Boolean(self.primaryAddress())) {
                return self.primaryAddress().fullAddressString();
            }
            return 'Address not shared.';
        };
    }

    function Category() {
        this.resource = '/categories';
        this.json = 'category';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'showDashboard');
        addPropertyTo(this, 'showPublic');
        addPropertyTo(this, 'domain', Domain);

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

        this.get = function (success, error) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };
    }

    function CompanyInvitation() {
        this.resource = '/company_invitations';
        this.json = 'companyInvitation';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'user_name');
        addPropertyTo(this, 'user_email');
        addPropertyTo(this, 'token');
        addPropertyTo(this, 'inviteAsAdmin');

        this.create = function (success, error, embed, as_domain) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: as_domain,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    data: error,
                    embed: embed});
        };

        this.get = function (success, error) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };

    }

    function ComponentTag() {
        this.resource = '/component_tags';
        this.json = 'componentTag';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');

        this.get = function (success, error) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };
    }

    function SpecificationFieldOption() {
        this.resource = '/specificationFieldOptions';
        this.json = 'specificationFieldOption';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'value');
        addPropertyTo(this, 'position');
        addPropertyTo(this, 'default');
        addPropertyTo(this, 'colour');
        addPropertyTo(this, 'specificationCost');
        addPropertyTo(this, 'specificationUnitCost');
        addPropertyTo(this, 'linkedFile', MerchiFile);
    }

    function SpecificationField() {
        this.resource = '/specificationFields';
        this.json = 'specificationField';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'fieldType');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'position');
        addPropertyTo(this, 'placeholder');
        addPropertyTo(this, 'defaultValue');
        addPropertyTo(this, 'required');
        addPropertyTo(this, 'independent');
        addPropertyTo(this, 'specificationCost');
        addPropertyTo(this, 'specificationUnitCost');
        addPropertyTo(this, 'options', SpecificationFieldOption);
        addPropertyTo(this, 'defaultOptions', SpecificationFieldOption);
        addPropertyTo(this, 'multipleSelect');
        addPropertyTo(this, 'rows');
        addPropertyTo(this, 'fieldMin');
        addPropertyTo(this, 'fieldMax');
        addPropertyTo(this, 'showFilePreview');
        addPropertyTo(this, 'allowDecimal');
        addPropertyTo(this, 'allowFileMultiple');
        addPropertyTo(this, 'allowFileJpeg');
        addPropertyTo(this, 'allowFileGif');
        addPropertyTo(this, 'allowFilePdf');
        addPropertyTo(this, 'allowFilePng');
        addPropertyTo(this, 'allowFileAi');

        this.isType = function (typeString) {
            return parseInt(this.fieldType(), 10) ===
                fieldTypes.get(typeString);
        };

        this.isTextTyoe = function () {
            return this.isType('TEXT_INPUT');
        };

        this.isNumberTyoe = function () {
            return this.isType('NUMBER_INPUT');
        };

        this.isSelectType = function () {
            return this.isType('SELECT');
        };

        this.isDefaultMultiSelect = function () {
            return this.isType('CHECKBOX') || this.isType('IMAGE_SELECT') &&
                this.multipleSelect();
        };

        this.isCheckboxType = function () {
            return this.isType('CHECKBOX');
        };

        this.isRadioType = function () {
            return this.isType('RADIO');
        };

        this.hasOptions = function () {
            return Boolean(this.options());
        };

        this.isCheckboxOrRadio = function () {
            return this.isCheckboxType() || this.isRadioType();
        };

        this.isTextAreaType = function () {
            return this.isType('TEXT_AREA');
        };

        this.isInstructionsType = function () {
            return this.isType('FIELD_INSTRUCTIONS');
        };

        this.isFileInput = function () {
            return this.isType('FILE_UPLOAD');
        };

        this.isColourPickerType = function () {
            return this.isType('COLOUR_PICKER');
        };

        this.isColourSelectType = function () {
            return this.isType('COLOUR_SELECT');
        };

        this.isImageSelectType = function () {
            return this.isType('IMAGE_SELECT');
        };

        this.isSelectable = function () {
            return this.isSelectType() || this.isCheckboxOrRadio() ||
                this.isImageSelectType() || this.isColourSelectType();
        };

        this.fieldInputTypeAttributeValue = function () {
            var inputType = this.fieldType(),
                inputTypeString = null;
            if (inputType === fieldTypes.get("TEXT_INPUT")) {
                inputTypeString = 'text';
            } else if (inputType === fieldTypes.get('FILE_UPLOAD')) {
                inputTypeString = 'file';
            } else if (inputType === fieldTypes.get('NUMBER_INPUT')) {
                inputTypeString = 'number';
            } else if (inputType === fieldTypes.get('RADIO')) {
                inputTypeString = 'radio';
            } else if (inputType === fieldTypes.get('IMAGE_SELECT')) {
                if (this.multipleSelect()) {
                    inputTypeString = 'checkbox';
                } else {
                    inputTypeString = 'radio';
                }
            } else if (inputType === fieldTypes.get('CHECKBOX')) {
                inputTypeString = 'checkbox';
            }
            return inputTypeString;
        };

        this.hasMultipleDefaults = function () {
            return this.optionsDefaults().length > 1;
        };

        this.optionsDefaults = function () {
            var i, defaultsArray = [],
                options = this.options();
            for (i = 0; i < options.length; i++) {
                if (options[i].default()) {
                    defaultsArray.push(options[i]);
                }
            }
            return defaultsArray;
        };

        this.findOptionById = function (id) {
            var i = 0, options;
            options = this.options();
            for (i = 0; i < options.length; i++) {
                if (parseInt(options[i].id(), 10) === parseInt(id, 10)) {
                    return options[i];
                }
            }
            return null;
        };

        this.allowFileJpegString = function () {
            return Boolean(this.allowFileJpeg()) ? ".jpeg, .jpg" : "";
        };

        this.allowFileGifString = function () {
            return Boolean(this.allowFileGif()) ? ".gif" : "";
        };

        this.allowFilePdfString = function () {
            return Boolean(this.allowFilePdf()) ? ".pdf" : "";
        };

        this.allowFilePngString = function () {
            return Boolean(this.allowFilePng()) ? ".png" : "";
        };

        this.allowFileAiString = function () {
            return Boolean(this.allowFileAi()) ? ".ai" : "";
        };

        this.allowedFileTypesString = function () {
            function appendType(fileTypeString) {
                if (fileTypeString !== "") {
                    return fileTypeString + ", ";
                }
                return "";
            }
            return appendType(this.allowFileJpegString()) +
                appendType(this.allowFileGifString()) +
                appendType(this.allowFilePdfString()) +
                appendType(this.allowFilePngString()) +
                appendType(this.allowFileAiString());
        };

        this.allowFileMultipleString = function () {
            if (this.allowFileMultiple()) {
                return "multiple";
            }
            return "";
        };

        this.buildEmptySpecification = function () {
            var specificationBuilt = new Specification(),
                value, options, i,
                onceOffCost = 0, specificationCost;
            if (this.isSelectable()) {
                options = this.options();
                value = [];
                for (i = 0; i < options.length; i++) {
                    if (options[i].default()) {
                        value.push(options[i].id());
                        onceOffCost += options[i].specificationCost();
                    }
                }
                specificationBuilt.value(value.join());
                specificationBuilt.onceOffCost(onceOffCost);
            } else {
                specificationBuilt.value(this.defaultValue());
                specificationBuilt.onceOffCost(this.specificationCost());
            }
            specificationBuilt.unitCostTotal('0');
            specificationBuilt.cost(specificationBuilt.onceOffCost());
            specificationBuilt.specificationField(clone(this));
            return specificationBuilt;
        };
    }

    function SpecificationOption() {
        this.json = 'specification_option';

        addPropertyTo(this, 'optionId');
        addPropertyTo(this, 'value');
        addPropertyTo(this, 'colour');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'onceOffCost');
        addPropertyTo(this, 'unitCost');
        addPropertyTo(this, 'unitCostTotal');
        addPropertyTo(this, 'totalCost');
        addPropertyTo(this, 'fieldName');

        // a hack around function for job cloneable renderering
        this.covertToSpecification = function () {
            var specificationConverted = new Specification(),
                unitCost = this.unitCost(),
                fieldName = this.fieldName(),
                optionValue = this.value(),
                totalCost = this.totalCost();
            specificationConverted.value(this.optionId());
            specificationConverted.quantity(this.quantity());
            specificationConverted.onceOffCost(this.onceOffCost());
            specificationConverted.unitCostTotal(this.unitCostTotal());
            // hack around for specification unit cost
            specificationConverted.unitCost = function () {
                return unitCost;
            };
            specificationConverted.valueString = function () {
                return optionValue;
            };
            specificationConverted.fieldName = function () {
                return fieldName;
            };
            return specificationConverted;
        };
    }

    function Specification() {
        this.resource = '/specification';
        this.json = 'specification';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'value');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'cost');
        addPropertyTo(this, 'onceOffCost');
        addPropertyTo(this, 'unitCost');
        addPropertyTo(this, 'unitCostTotal');
        addPropertyTo(this, 'selectedOptions', SpecificationOption);
        addPropertyTo(this, 'specificationField', SpecificationField);
        addPropertyTo(this, 'specificationFiles', MerchiFile);

        this.isTextField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isTextTyoe();
        };

        this.isNumberField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isNumberTyoe();
        };

        this.isSelectField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isSelectType();
        };

        this.isCheckBoxField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isCheckboxType();
        };

        this.isRadioField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isRadioType();
        };

        this.isColourSelectField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isColourSelectType();
        };

        this.isImageSelectField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isImageSelectType();
        };

        this.isCheckboxOrRadioField = function () {
            return this.isRadioField() || this.isCheckBoxField();
        };

        this.isSelectableField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isSelectable();
        };

        this.canHaveMultipleSelected = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isDefaultMultiSelect();
        };

        this.isTextAreaField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isTextAreaType();
        };

        this.isInstructionsField = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isInstructionsType();
        };

        this.isFileUpload = function () {
            var field = this.specificationField();
            return Boolean(field) && field.isFileInput();
        };

        this.valueArray = function (updateValueArray) {
            var valuesArray = [], i;
            if (!isUndefined(updateValueArray)) {
                this.value(updateValueArray.join(','));
                return updateValueArray;
            }
            if (this.value() === "") {
                return [];
            }
            valuesArray = String(this.value()).split(',');
            for (i = 0; i < valuesArray.length; i++) {
                valuesArray[i] = parseInt(valuesArray[i], 10);
            }
            return valuesArray;
        };

        this.textValue = function () {
            var field = this.specificationField(),
                text = "", option, i;
            if (Boolean(field)) {
                if (this.isTextField() || this.isNumberField() ||
                    this.isTextAreaField()) {
                    return this.value();
                }
                if (this.isSelectableField() && this.selectedOptions()) {
                    for (i = 0; i < this.selectedOptions().length; i++) {
                        text += this.selectedOptions()[i].value() + " ";
                    }
                    return text;
                }
            }
            return null;
        };

        this.selectedFieldOptions = function () {
            var field = this.specificationField(),
                options = field.options(),
                valueArray = this.valueArray(),
                optionsArray = [], selectedId, option, i, z;
            for (i = 0; i < valueArray.length; i++) {
                selectedId = valueArray[i];
                for (z = 0; z < options.length; z++) {
                    option = options[z];
                    if (selectedId === option.id()) {
                        optionsArray.push(option);
                    }
                }
            }
            return optionsArray;
        };

        this.findOptionValueIndex = function (optionId) {
            return this.valueArray().indexOf(parseInt(optionId, 10));
        };

        this.optionIsChecked = function (optionId) {
            return this.findOptionValueIndex(optionId) > -1;
        };

        this.addOptionToValueArray = function (optionId) {
            var newValueArray = this.valueArray();
            if (!this.optionIsChecked(optionId)) {
                newValueArray.push(optionId);
                this.valueArray(newValueArray);
            }
        };

        this.removeOptionFromValueArray = function (optionId) {
            var index = this.findOptionValueIndex(optionId),
                newValueArray = this.valueArray();
            newValueArray.splice(index, 1);
            this.valueArray(newValueArray);
        };

        this.fieldName = function () {
            return this.specificationField().name();
        };

        this.fieldType = function () {
            return this.specificationField().fieldType();
        };

        this.hasOptions = function () {
            return Boolean(this.selectedOptions());
        };

        this.hasMultipleOptions = function () {
            return parseInt(this.fieldType(), 10) ===
                fieldTypes.get("CHECKBOX");
        };

        this.isFileUpload = function () {
            return parseInt(this.fieldType(), 10) ===
                fieldTypes.get("FILE_UPLOAD");
        };

        this.isColourPicker = function () {
            return parseInt(this.fieldType(), 10) ===
                fieldTypes.get("COLOUR_PICKER");
        };

        this.clone = function () {
            var cloneSpecification = new Specification();
            cloneSpecification.value(this.value());
            cloneSpecification.cost(this.cost());
            cloneSpecification.specificationField(this.specificationField());
            cloneSpecification.specificationFiles(this.specificationFiles());
            return cloneSpecification;
        };

        this.unitCost = function () {
            var field = this.specificationField();
            if (field.isSelectType()) {
                return field.findOptionById(this.value()).specificationUnitCost();
            }
            return field.specificationUnitCost();
        };

        this.valueString = function () {
            var field = this.specificationField();
            if (field.isSelectType()) {
                return field.findOptionById(this.value()).value();
            } else if (this.isFileUpload() &&
                       Boolean(this.specificationFiles())) {
                if (this.specificationFiles().length > 1) {
                    return 'uploaded files';
                }
                return 'uploaded file';
            }
            return this.value();
        };

    }

    function removeUnstoredFiles(files, removeAll) {
        var unUploadedFiles, count = 1, i;

        if (Boolean(removeAll)) {
            count = files.filter(function (file) {
               return isUndefinedOrNull(file.id());
            }).length;
        }

        for (i = 0; i < count; i++) {
            files.splice(files.findIndex(function (obj) {
                return obj.id() === null;
            }), 1);
        }
        return files;
   }

    function SpecificationsGroup() {
        this.resource = '/specificationsGroups';
        this.json = 'specificationsGroup';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'groupCost');
        addPropertyTo(this, 'specifications', Specification);

        this.clone = function () {
            var groupClone = new MERCHI.SpecificationsGroup(),
                specificationsClone = [], i;
            groupClone.groupCost(this.groupCost());
            groupClone.quantity(this.quantity());
            for (i = 0; i < this.specifications().length; i++) {
                specificationsClone.push(this.specifications()[i].clone());
            }
            return groupClone.specifications(specificationsClone);
        };
    }

    function Product() {
        this.resource = '/products';
        this.json = 'product';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'description');
        addPropertyTo(this, 'notes');
        addPropertyTo(this, 'minimum');
        addPropertyTo(this, 'deliveryDaysNormal');
        addPropertyTo(this, 'bestPrice');
        addPropertyTo(this, 'unitWeight');
        addPropertyTo(this, 'unitHeight');
        addPropertyTo(this, 'unitWidth');
        addPropertyTo(this, 'unitDepth');
        addPropertyTo(this, 'unitVolume');
        addPropertyTo(this, "needsDrafting");
        addPropertyTo(this, "needsProduction");
        addPropertyTo(this, "needsShipping");
        addPropertyTo(this, "suppliers", User);
        addPropertyTo(this, "groupVariationFields", SpecificationField);
        addPropertyTo(this, "independentVariationFields", SpecificationField);
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'unitPrice');
        addPropertyTo(this, 'files', MerchiFile);
        addPropertyTo(this, 'showPublic');
        addPropertyTo(this, 'acceptStripe');
        addPropertyTo(this, 'acceptPaypal');
        addPropertyTo(this, 'acceptBankTransfer');
        addPropertyTo(this, 'acceptPhonePayment');
        addPropertyTo(this, 'allowPaymentUpfront');
        addPropertyTo(this, 'allowQuotation');

        this.create = function (success, error, embed, as_domain) {
            var data = new Dictionary(),
                self = this;
            data.add('name', this.name());
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    data: data,
                    as_domain: as_domain,
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.get = function (success, error, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(),
                handleResponse, error, embed);
        };

        this.specificationFields = function () {
            var specificationFields = [];
            if (MERCHI.notEmptyArray(this.groupVariationFields())) {
                specificationFields = specificationFields.
                    concat(this.groupVariationFields());
            }

            if (MERCHI.notEmptyArray(this.independentVariationFields())) {
                specificationFields = specificationFields.
                    concat(this.independentVariationFields());
            }
            return specificationFields;
        };

        this.primaryImage = function () {
            if (Boolean(this.files()) && Boolean(this.files()[0])) {
                return this.files()[0];
            }
            return null;
        };

        this.productPrimaryImage = function () {
            if (Boolean(this.files()) && Boolean(this.files()[0])) {
                return this.files()[0].viewUrl();
            }
            return null;
        };

        this.productCurrency = function () {
            var self = this;

            if (Boolean(self.domain()) && Boolean(self.domain().company())) {
                return self.domain().company().defaultCurrency();
            }
            return null;
        };

        this.hasGroupVariationFields = function () {
            return MERCHI.notEmptyArray(this.groupVariationFields());
        };

        this.hasIndependentVariationFields = function () {
            return MERCHI.notEmptyArray(this.independentVariationFields());
        };

        this.buildEmptySpecificationsGroup = function () {
            var specificationsGroupBuilt = new SpecificationsGroup(),
                groupVariationFields = this.groupVariationFields(),
                emptyGroupCost = 0,
                specifications = [],
                i,
                emptySpecification;
            specificationsGroupBuilt.quantity('0');

            for (i = 0; i < groupVariationFields.length; i++) {
                emptySpecification =
                    groupVariationFields[i].buildEmptySpecification();
                specifications.push(emptySpecification);
                emptyGroupCost += parseFloat(emptySpecification.cost(), 10);
            }

            specificationsGroupBuilt.groupCost(emptyGroupCost.toString());
            specificationsGroupBuilt.specifications(specifications);
            return specificationsGroupBuilt;
        };

        this.buildEmptySpecifications = function () {
            var emptySpecifications = [],
                emptySpecification,
                independentVariationFields = this.independentVariationFields(),
                i;

            for (i = 0; i < independentVariationFields.length; i++) {
                emptySpecification =
                    independentVariationFields[i].buildEmptySpecification();
                emptySpecifications.push(emptySpecification);
            }
            return emptySpecifications;
        };

        this.tax = function () {
            if (Boolean(this.domain()) && Boolean(this.domain().company())) {
                return this.domain().company().defaultTaxType();
            }
            return null;
        };

        this.previewImages = function (maxImages) {
            var files = this.files();
            if (Boolean(files)) {
                return files.slice(0, maxImages);
            }
            return [];
        };
    }

    function BidItem() {
        this.resource = '/bid_items';
        this.json = 'bidItem';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'type');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'description');
        addPropertyTo(this, 'unitPrice');

        this.get = function (success, error) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };

        this.total = function () {
            var self = this,
                quantity = Boolean(self.quantity()) ? self.quantity() : 0,
                unitPrice = Boolean(self.unitPrice()) ? self.unitPrice() : 0,
                total;
            total = quantity * unitPrice;
            return total.toFixed(3);
        };
    }

    function Bid() {
        this.resource = '/bids';
        this.json = 'bid';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'agreedDeadline');
        addPropertyTo(this, 'bidItems', BidItem);
        addPropertyTo(this, 'assignments', Assignment);

        this.get = function (success, error) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };

        this.quoteTotal = function () {
            var self = this,
                items = Boolean(self.bidItems()) ? self.bidItems() : [],
                total = parseFloat(0.000), item, i;
            for (i = 0; i < items.length; i++) {
                total += parseFloat(items[i].total());
            }
            return total;
        };

        this.deadlineTimeDifference = function () {
            var self = this,
                proposedDeadline = Boolean(self.agreedDeadline()) ?
                    self.agreedDeadline() : null,
                assignments = Boolean(self.assignments()) ?
                    self.assignments() : null,
                assignment = Boolean(assignments) && assignments.length > 0 ?
                    assignments[0] : null,
                productionDeadline = Boolean(assignment) ?
                    assignment.productionDeadline() : null;
            if (Boolean(proposedDeadline) && Boolean(productionDeadline)) {
                return productionDeadline - proposedDeadline;
            }
            return null;
        };

        this.findQuoteItemIndex = function (quoteItemId) {
            var self = this,
                quoteItems = Boolean(self.bidItems()) ? self.bidItems() : [];
            return quoteItems.findIndex(function (arrayElement) {
                    return String(arrayElement.id()) === String(quoteItemId);
                });
        };

        this.removeQuoteItem = function (quoteItem) {
            var self = this,
                itemIndex = self.findQuoteItemIndex(quoteItem.id()),
                bidItems = self.bidItems();
            if (Boolean(bidItems) && itemIndex >= 0) {
                bidItems.splice(itemIndex, 1);
            }
        };
    }

    function Shipment() {
        this.resource = '/shipments';
        this.json = 'shipment';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'creationDate');
        addPropertyTo(this, 'dispatchDate');
        addPropertyTo(this, 'dispatchedDate');
        addPropertyTo(this, 'expectedReceiveDate');
        addPropertyTo(this, 'receivedDate');
        addPropertyTo(this, 'sender', User);
        addPropertyTo(this, 'senderCompany', Company);
        addPropertyTo(this, 'senderAddress', Address);
        addPropertyTo(this, 'senderNotes');
        addPropertyTo(this, 'receiver', User);
        addPropertyTo(this, 'receiverCompany', Company);
        addPropertyTo(this, 'receiverAddress', Address);
        addPropertyTo(this, 'receiverNotes');
        addPropertyTo(this, 'invoice', Invoice);
        addPropertyTo(this, 'jobs', Job);
        addPropertyTo(this, 'assignments', Assignment);
        addPropertyTo(this, 'trackingNumber');
        addPropertyTo(this, 'transportCompany');
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');
        addPropertyTo(this, 'cost');
        addPropertyTo(this, 'taxAmount');
        addPropertyTo(this, 'maxWeight');
        addPropertyTo(this, 'maxVolume');
        addPropertyTo(this, 'taxType', CountryTax);
        addPropertyTo(this, 'senderResponsible');

        this.get = function (success, error) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error);
        };

        this.create = function (success, error, embed) {
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
                    embed: embed});
        };

        this.patch = function (success, error, data, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      error: error,
                      data: data,
                      embed: embed});
        };

        this.update = function (success, error, embed) {
            var self = this;
            this.patch(success, error, serialise(self)[0], embed);
        };

        this.hasJobs = function () {
            return Boolean(this.jobs()) && this.jobs().length > 0;
        };

        this.hasJob = function (job) {
            var jobIndex = this.jobs().findIndex(function (shipmentJob) {
                return shipmentJob.id() === job.id();
            });
            return jobIndex >= 0;
        };

        this.hasAssignments = function () {
            return Boolean(this.assignments()) && this.assignments().length > 0;
        };

        this.hasAssignment = function (assignment) {
            var assignments = this.assignments(),
                assignmentIndex;
            if (Boolean(assignments)) {
                assignmentIndex = assignments.findIndex(
                    function (shipmentAssignment) {
                        return shipmentAssignment.id() === assignment.id();
                    });
                return assignmentIndex >= 0;
            }
            return false;
        };

        this.removeAssignment = function (assignmentId) {
            var self = this;
            if (Boolean(assignmentId) && assignmentId !== '') {
                removeObjectFromArrayWithIntegerValue(self.assignments(),
                                                      'id', assignmentId);
            }
        };

        this.removeJob = function (jobId) {
            var self = this;
            if (Boolean(jobId) && jobId !== '') {
                removeObjectFromArrayWithIntegerValue(self.jobs(), 'id', jobId);
            }
        };

        this.readyForDispatchedNotification = function () {
            var self = this;
            return Boolean(self.id() && self.trackingNumber() &&
                self.transportCompany() && self.dispatchedDate());
        };
    }

    function Assignment() {
        this.resource = '/assignments';
        this.json = 'assignment';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'managerAccepts');
        addPropertyTo(this, 'supplierRefused');
        addPropertyTo(this, 'productionDeadline');
        addPropertyTo(this, 'assignmentDeadline');
        addPropertyTo(this, 'job', Job);
        addPropertyTo(this, 'supplier', User);
        addPropertyTo(this, 'bid', Bid);
        addPropertyTo(this, 'shipment', Shipment);
        addPropertyTo(this, 'comments', ProductionComment);
        addPropertyTo(this, 'notifications', Notification);

        this.get = function (success, error, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error,
                   embed);
        };

        this.agreedDeadline = function () {
            var self = this,
                bid = self.bid();
            if (Boolean(bid)) {
                return bid.agreedDeadline();
            }
            return null;
        };

        this.create = function (success, error, embed, asDomainId) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: asDomainId,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.patch = function (success, error, embed, asDomain) {
            var self = this,
                data = serialise(this)[0],
                domainId = Boolean(asDomain) ? asDomain.id() : null;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      error: error,
                      as_domain: domainId,
                      data: data,
                      embed: embed});
        };

        this.setManagerAccepts = function () {
            var acceptDate = Date.now();
            this.managerAccepts(acceptDate / 1000);
        };

        this.agreedDeadline = function () {
            var self = this,
                quote = self.bid();
            if (Boolean(quote) && Boolean(quote.agreedDeadline())) {
                return quote.agreedDeadline();
            }
            return null;
        };

        this.unseenNotifications = function (currentUser) {
            var notifications =
                notificationRecieverIsCurrentUserFilter(currentUser,
                                                        this.notifications());
            return notificationsFilter(notifications, [{'seen': false}]);
        };

        this.unseenNotificationCount = function (currentUser) {
            return this.unseenNotifications(currentUser).length;
        };

        this.unseenCommentNotifications = function (currentUser) {
            var noteType = notificationTypes.get('PRODUCTION_COMMENT'),
                notifications = this.unseenNotifications(currentUser);
            return notificationsFilter(notifications,
                [{'notificationType': noteType}]);
        };

        this.unseenCommentNotificationsCount = function (currentUser) {
            return this.unseenCommentNotifications(currentUser).length;
        };

        this.unseenQuoteNotifications = function (currentUser) {
            var approved = notificationTypes.get('QUOTE_APPROVED'),
                supplierRefused = notificationTypes.get('SUPPLIER_REFUSED'),
                refused = notificationTypes.get('QUOTE_REFUSED'),
                submitted = notificationTypes.get('QUOTE_SUBMITTED'),
                failed = notificationTypes.get('QUOTE_FAILED'),
                commenced = notificationTypes.get('QUOTE_COMMENCED'),
                expired = notificationTypes.get('QUOTE_EXPIRED'),
                notifications = this.unseenNotifications(currentUser);
            return notificationsFilter(notifications,
                [{'notificationType': approved}, {'notificationType': refused},
                 {'notificationType': submitted}, {'notificationType': failed},
                 {'notificationType': commenced}, {'notificationType': expired},
                 {'notificationType': supplierRefused}]);
        };

        this.isUserSupplier = function (user) {
            var self = this;
            if (Boolean(self.supplier()) &&
                self.supplier().id() === user.id()) {
                return true;
            }
            return false;
        };
    }

    function JobComment() {
        this.resource = '/job_comments';
        this.json = 'jobComment';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'job', Job);
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'file', MerchiFile);
        addPropertyTo(this, 'notifications', Notification);
        addPropertyTo(this, 'date');
        addPropertyTo(this, 'text');
        addPropertyTo(this, 'urgency');
        addPropertyTo(this, 'subject');
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');
    }

    function DraftComment() {
        this.resource = '/draft_comments';
        this.json = 'draftComment';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'file', MerchiFile);
        addPropertyTo(this, 'notifications', Notification);
        addPropertyTo(this, 'date');
        addPropertyTo(this, 'text');
        addPropertyTo(this, 'urgency');
        addPropertyTo(this, 'subject');
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');
        addPropertyTo(this, 'changeRequest');
    }

    function ProductionComment() {
        this.resource = '/production_comments';
        this.json = 'productionComment';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'file', MerchiFile);
        addPropertyTo(this, 'notifications', Notification);
        addPropertyTo(this, 'assignment', Assignment);
        addPropertyTo(this, 'date');
        addPropertyTo(this, 'text');
        addPropertyTo(this, 'urgency');
        addPropertyTo(this, 'subject');
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');
        addPropertyTo(this, 'isUrgentQuestion');

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
    }

    function Payment() {
        this.resource = '/payments';
        this.json = 'payments';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'note');
        addPropertyTo(this, 'paymentType');
        addPropertyTo(this, 'payDate');
        addPropertyTo(this, 'amount');
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');
        addPropertyTo(this, 'paymentRecorder', User);
    }

    function CountryTaxes() {
        this.resource = '/country_taxes';
        this.json = 'countryTaxes';
        this.single = CountryTax;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };

        this.jsonsForOptions = function (taxes, selectedTaxId) {
            var result = [],
                i;
            for (i = 0; i < taxes.length; i++) {
                result.push({name: taxes[i].wrapedRepresentation(),
                             selected: selectedTaxId &&
                                        taxes[i].id() === selectedTaxId ||
                                       !selectedTaxId &&
                                        taxes[i].id() === window.taxType,
                             id: taxes[i].id()});
            }
            return result;
        };
    }

    function Item() {
        this.resource = '/items';
        this.json = 'items';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'taxType', CountryTax);
        addPropertyTo(this, 'taxAmount');
        addPropertyTo(this, 'cost');
        addPropertyTo(this, 'description');
    }

    function Invoice() {
        this.resource = '/invoices';
        this.json = 'invoice';

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
        addPropertyTo(this, 'responsibleManager', User);
        addPropertyTo(this, 'creator', User);
        addPropertyTo(this, 'client', User);
        addPropertyTo(this, 'clientEmail', EmailAddress);
        addPropertyTo(this, 'clientPhone', PhoneNumber);
        addPropertyTo(this, 'clientCompany', Company);
        addPropertyTo(this, 'clientCompanyEmail', EmailAddress);
        addPropertyTo(this, 'clientCompanyPhone', PhoneNumber);
        addPropertyTo(this, 'jobs', Job);
        addPropertyTo(this, 'items', Item);
        addPropertyTo(this, 'shipping', Address);
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'pdf', MerchiFile);
        addPropertyTo(this, 'receipt', MerchiFile);
        addPropertyTo(this, 'payments', Payment);
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'acceptStripe');
        addPropertyTo(this, 'acceptPaypal');
        addPropertyTo(this, 'acceptBankTransfer');
        addPropertyTo(this, 'acceptPhonePayment');

        this.create = function (success, error, embed, as_domain) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: as_domain,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.company = function () {
            var self = this;
            if (Boolean(self.domain()) && Boolean(self.domain().company())) {
                return self.domain().company();
            }
            return null;
        };

        this.calculate = function (success, error, embed) {
            var self = this,
                request = new Request(),
                data = serialise(this)[0];
            request.resource('/invoice-cost-estimate/');
            request.method('POST');
            request.data().merge(data);
            function handleResponse(status, body) {
                var result = '';
                if (status === 201) {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'invalid json from server'};
                    }
                    success(fromJson(self, result));
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'could not get quote'};
                    }
                    error(result);
                }
            }
            function handleError() {
                error({message: 'could not connect to server'});
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };
    }

    function Notification() {
        this.resource = '/notifications';
        this.json = 'notification';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'recipient', User);
        addPropertyTo(this, 'sender', User);
        addPropertyTo(this, 'date');
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'relatedJob', Job);
        addPropertyTo(this, 'attachment', MerchiFile);
        addPropertyTo(this, 'seen');
        addPropertyTo(this, 'description');
        addPropertyTo(this, 'urgency');
        addPropertyTo(this, 'subject');
        addPropertyTo(this, 'message');
        addPropertyTo(this, 'link');
        addPropertyTo(this, 'section');
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');
        addPropertyTo(this, 'notificationType');
        addPropertyTo(this, 'relatedJobComment', JobComment);
        addPropertyTo(this, 'relatedDraftComment', DraftComment);
        addPropertyTo(this, 'relatedProductionComment', ProductionComment);
        addPropertyTo(this, 'relatedInvoice', Invoice);

        this.title = function () {
            if (this.subject() && this.subject() !== 'None') {
                if (this.relatedJob()) {
                    return this.subject() + " - " + this.domain().emailDomain();
                }
                return this.subject();
            }
            return this.description();
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

        this.avatarUrl = function () {
            var self = this,
                noteType = self.notificationType(),
                sender = self.sender(),
                senderAvatarUri =
                    Boolean(sender && sender.profilePicture()) ?
                        sender.profilePicture().viewUrl() :
                            defaultUserAvatar,
                domain = self.domain(),
                domainAvatarUri = Boolean(domain && domain.logo()) ?
                    domain.logo().viewUrl() : platformIcon;
            if (isAvatarTypeInNotificationAvatar('SHOW_USER_AVATAR', noteType)) {
                return senderAvatarUri;
            } else if (isAvatarTypeInNotificationAvatar('SHOW_DOMAIN_AVATAR',
                                                        noteType)) {
                return domainAvatarUri;
            } else if (isAvatarTypeInNotificationAvatar(
                           'SHOW_USER_OR_DOMAIN_AVATAR', noteType)) {
                return Boolean(sender) ? senderAvatarUri : domainAvatarUri;
            } else if (isAvatarTypeInNotificationAvatar(
                           'SHOW_DOMAIN_OR_USER_AVATAR', noteType)) {
                return Boolean(domain) ? domainAvatarUri : senderAvatarUri;
            }
            return domainAvatarUri;
        };

        this.iconClass = function () {
            return notificationSectionIconClass.get(this.section());
        };

        this.checkKeyValue = function (key, value) {
            var self = this;
            if (self[key]() === value) {
                return self;
            }
            return null;
        };
    }

    function Job() {
        this.resource = '/jobs';
        this.json = 'job';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'notes');
        addPropertyTo(this, 'product', Product);
        addPropertyTo(this, 'priority');
        addPropertyTo(this, 'received');
        addPropertyTo(this, 'deadline');
        addPropertyTo(this, 'updated');
        addPropertyTo(this, 'drafts');
        addPropertyTo(this, 'comments');
        addPropertyTo(this, 'invoice', Invoice);
        addPropertyTo(this, 'shipment', Shipment);
        addPropertyTo(this, 'client', User);
        addPropertyTo(this, 'manager', User);
        addPropertyTo(this, 'designer', User);
        addPropertyTo(this, 'shipping', Address);
        addPropertyTo(this, 'productionShippingAddress', Address);
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'cost');
        addPropertyTo(this, 'taxAmount');
        addPropertyTo(this, 'taxType', CountryTax);
        addPropertyTo(this, 'costPerUnit');
        addPropertyTo(this, 'automaticPriceEnabled');

        // not embedded by default
        addPropertyTo(this, 'unreadNotificationsCount');

        addPropertyTo(this, 'productionNotes');
        addPropertyTo(this, 'productionStatus');
        addPropertyTo(this, "needsDrafting");
        addPropertyTo(this, "needsProduction");
        addPropertyTo(this, "needsShipping");
        addPropertyTo(this, 'shippingStatus');
        addPropertyTo(this, 'designStatus');
        addPropertyTo(this, 'paymentStatus');
        addPropertyTo(this, 'assignments', Assignment);
        addPropertyTo(this, 'clientCompany', Company);
        addPropertyTo(this, 'archived');
        addPropertyTo(this, 'notifications', Notification);
        addPropertyTo(this, 'specificationsGroups', SpecificationsGroup);
        addPropertyTo(this, 'specifications', Specification);
        addPropertyTo(this, 'jobVolume');
        addPropertyTo(this, 'jobWeight');

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

        this.get = function (success, error, embed, include_archived) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            getOne(this.resource, this.id(), handleResponse, error,
                   embed, include_archived);
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };

        this.recover = function (success, error) {
            recoverOne("jobs", this.id(), success, error);
        };

        this.patch = function (success, error, embed, asDomain) {
            var self = this,
                data = serialise(this)[0],
                domain = Boolean(self.domain()) ? self.domain().id() : null,
                domainId = isUndefined(asDomain) ? domain : asDomain;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      error: error,
                      as_domain: domainId,
                      data: data,
                      embed: embed});
        };

        this.hasSpecifications = function () {
            var specifications = this.specifications();
            return Boolean(specifications) && specifications.length > 0;
        };

        this.hasSpecificationsGroups = function () {
            var groups = this.specificationsGroups();
            return Boolean(groups) && groups.length > 0;
        };

        this.specificationGroupsTotalQuantity = function () {
            var self = this,
                groups = Boolean(self.specificationsGroups()) ?
                    self.specificationsGroups() : [],
                totalQuantity = 0,
                group, groupQuantity, i;
            for (i = 0; i < groups.length; i++) {
                group = groups[i];
                groupQuantity = isNaN(group.quantity()) ? 0 : group.quantity();
                totalQuantity += parseInt(groupQuantity, 10);
            }
            return totalQuantity;
        };

        this.productTotalCost = function () {
            var self = this;
            return self.costPerUnit() * self.quantity();
        };

        this.productionAcceptedAssignment = function () {
            var self = this,
                assignments = Boolean(self.assignments()) ? self.assignments() : [],
                assignment,
                i;
            for (i = 0; i < assignments.length; i++) {
                assignment = assignments[i];
                if (assignment.managerAccepts()) {
                    return assignment;
                }
            }
            return null;
        };

        this.productionQuotingComplete = function () {
            var self = this,
                assignmentReached =
                    jobStatusProduction.get('ASSIGN_DEADLINE_REACHED');
            if (Boolean(self.productionAcceptedAssignment()) ||
                self.productionStatus() >= assignmentReached) {
                return true;
            }
            return false;
        };


        this.assignmentArrayIndexById = function (assignmentId) {
            return this.assignments().findIndex(function (assignment) {
                return assignmentId === assignment.id();
            });
        };

        this.assignmentBySupplier = function (supplier) {
            var self = this,
                assignments = self.assignments(),
                assignment,
                i;
            if (Boolean(assignments)) {
                for (i = 0; i < assignments.length; i++) {
                    assignment = self.assignments()[i];
                    if (assignment.isUserSupplier(supplier)) {
                        return assignment;
                    }
                }
            }
            return null;
        };

        this.findAssignmentById = function (assignmentId) {
            var self = this,
                index = self.assignmentArrayIndexById(assignmentId);
            if (!isNaN(index) && index !== -1) {
                return self.assignments()[index];
            }
            return null;
        };

        this.fetchAndUpdateAssignmentById = function (success, error,
                                                      assignmentId, embed) {
            var self = this,
                assignment = self.findAssignmentById(assignmentId),
                index = self.assignmentArrayIndexById(assignmentId);
            if (Boolean(assignment)) {
                assignment.get(function (latestAssignment) {
                    self.assignments()[index] = latestAssignment;
                    success();
                }, error, embed);
            } else {
                error();
            }
        };

        this.assignedSupplierIdArray = function () {
            // return an array of suppliers who have assignments
            var self = this,
                assignments = Boolean(self.assignments()) ?
                    self.assignments() : [],
                supplierIds = [],
                i;
            for (i = 0; i < assignments.length; i++) {
                supplierIds.push(assignments[i].supplier().id());
            }
            return supplierIds;
        };

        this.updateDateOfAssignments = function (newDate, dateAttribute) {
            var self = this,
                assignments = Boolean(self.assignments()) ?
                    self.assignments() : [],
                i;
            for (i = 0; i < assignments.length; i++) {
                // new date should be in current user unix local time
                assignments[i][dateAttribute](newDate);
            }
        };

        this.firstAssignment = function () {
            var self = this,
                assignments = Boolean(self.assignments()) ? self.assignments() : [];
            return assignments[0];
        };

        this.productionShipment = function () {
            var self = this,
                acceptedAssignment = self.productionAcceptedAssignment();
            return Boolean(acceptedAssignment) ?
                acceptedAssignment.shipment() : null;
        };

        this.productionDeadline = function () {
            var self = this,
                firstAssignment = self.firstAssignment();
            return Boolean(firstAssignment) ?
                firstAssignment.productionDeadline() : null;
        };

        this.productionAssignmentDeadline = function () {
            var self = this,
                firstAssignment = self.firstAssignment();
            return Boolean(firstAssignment) ?
                firstAssignment.assignmentDeadline() : null;
        };
    }

    /** Collections **/

    function PhoneNumbers() {
        this.resource = '/phone_numbers';
        this.json = 'phoneNumbers';
        this.single = PhoneNumber;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function EmailAddresses() {
        this.resource = '/email_addresses';
        this.json = 'emailAddresses';
        this.single = EmailAddress;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function Addresses() {
        this.resource = '/addresses';
        this.json = 'addresses';
        this.single = Address;

        this.getRelated = function (success, error, userId, companyId, jobId) {
            var request = new Request(),
                query = new Dictionary(),
                self = this;
            if (Boolean(userId)) {
                query.add('user_id', userId);
            }
            if (Boolean(companyId)) {
                query.add('company_id', companyId);
            }
            if (Boolean(jobId)) {
                query.add('job_id', jobId);
            }
            request.resource('/related-addresses/');
            request.method('GET');
            request.query().merge(query);
            function handleResponse(status, body) {
                var result = '';
                if (status === 200) {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Invalid json from server'};
                    }
                    success(fromJsonList(self, result));
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Unable to create order'};
                    }
                    error(result);
                }
            }
            function handleError() {
                error({message: 'could not connect to server'});
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };
    }

    function Users() {
        this.resource = '/users';
        this.json = 'users';
        this.single = User;

        this.get = function (success, error, offset, limit, q, embed,
                             tab, inDomain, relatedJob, companyId,
                             jobNotifiable, section, inDomainRoles) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                {offset: offset, limit: limit, q: q, tab: tab,
                    inDomain: inDomain, inDomainRoles: inDomainRoles,
                    relatedJob: relatedJob, companyId: companyId,
                    embed: embed, section: section,
                    jobNotifiable: jobNotifiable});
        };

        this.getRolesInDomain = function (success, error, domainId, roles,
                                          q, offset, limit, query, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(self.resource, handleResponse, error,
                {offset: offset, limit: limit, q: q,
                    inDomain: domainId, inDomainRoles: roles,
                    embed: embed});
        };

    }

    function Domains() {
        this.resource = '/domains';
        this.json = 'domains';
        this.single = Domain;

        this.get = function (success, error, offset, limit, q,
                             managedDomainsOnly) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q,
                     managedDomainsOnly: managedDomainsOnly});
        };

    }

    function Themes() {
        this.resource = '/themes';
        this.json = 'themes';
        this.single = Theme;

        this.get = function (success, error, offset, limit, q, tab, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q,
                     tab: tab, embed: embed});
        };

    }

    function Companies() {
        this.resource = '/companies';
        this.json = 'companies';
        this.single = Company;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function Categories() {
        this.resource = '/categories';
        this.json = 'categories';
        this.single = Category;

        this.get = function (success, error, offset, limit, q,
                             domainId, managedDomainsOnly) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q,
                     inDomain: domainId,
                     managedDomainsOnly: managedDomainsOnly});
        };
    }

    function CompanyInvitations() {
        this.resource = '/company_invitations';
        this.json = 'companyInvitations';
        this.single = CompanyInvitation;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function ComponentTags() {
        this.resource = '/component_tags';
        this.json = 'componentTags';
        this.single = ComponentTag;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function Invoices() {
      this.resource = '/invoices';
      this.json = 'invoices';
      this.single = Invoice;

      this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error, parameters);
      };
    }

    function Products() {
        this.resource = '/products';
        this.json = 'products';
        this.single = Product;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function BidItems() {
        this.resource = '/bid_items';
        this.json = 'bidItems';
        this.single = BidItem;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function Bids() {
        this.resource = '/bids';
        this.json = 'bids';
        this.single = Bid;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function Assignments() {
        this.resource = '/assignments';
        this.json = 'assignments';
        this.single = Assignment;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };

        this.getRelatedReadyForShipment = function (success, error, jobId,
                                                    supplierId,
                                                    receiverCompanyId) {
            var request = new Request(),
                query = new Dictionary(),
                self = this;

            if (Boolean(jobId)) {
                query.add('job_id', jobId);
            }
            if (Boolean(supplierId)) {
                query.add('supplier_id', supplierId);
            }
            if (Boolean(receiverCompanyId)) {
                query.add('receiver_company_id', receiverCompanyId);
            }
            request.resource('/related-assignments-ready-for-shipment/');
            request.method('GET');
            request.query().merge(query);
            function handleResponse(status, body) {
                var result = '';
                if (status === 200) {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Invalid json from server'};
                    }
                    success(fromJsonList(self, result));
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Unable to create order'};
                    }
                    error(result);
                }
            }
            function handleError() {
                error({message: 'could not connect to server'});
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };
    }

    function Jobs() {
        this.resource = '/jobs';
        this.json = 'jobs';
        this.single = Job;

        this.get = function (success, error, queryObject, withUpdates) {
            var self = this;

            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            return getList(this.resource, handleResponse, error, queryObject,
                           withUpdates);
        };

        this.getRelatedReadyForShipment = function (success, error, jobId,
                                                    clientId, companyId, addressId,
                                                    forProduction) {
            var request = new Request(),
                query = new Dictionary(),
                self = this;

            if (Boolean(jobId)) {
                query.add('job_id', jobId);
            }
            if (Boolean(clientId)) {
                query.add('client_id', clientId);
            }
            if (Boolean(companyId)) {
                query.add('company_id', companyId);
            }
            if (Boolean(addressId)) {
                query.add('address_id', addressId);
            }
            if (forProduction) {
                query.add('for_production', forProduction);
            }
            request.resource('/related-jobs-ready-for-shipment/');
            request.method('GET');
            request.query().merge(query);
            function handleResponse(status, body) {
                var result = '';
                if (status === 200) {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Invalid json from server'};
                    }
                    success(fromJsonList(self, result));
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Unable to create order'};
                    }
                    error(result);
                }
            }
            function handleError() {
                error({message: 'could not connect to server'});
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };
    }

    function Notifications() {
        this.resource = '/notifications';
        this.json = 'notifications';
        this.single = Notification;

        this.get = function (success, error, queryObject) {
            var self = this;

            function handleResponse(result) {
                success(fromJsonList(self, result));
            }

            getList(this.resource, handleResponse, error, queryObject);
        };
    }

    function Shipments() {
        this.resource = '/shipments';
        this.json = 'shipments';
        this.single = Shipment;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function EnrolledDomains() {
        this.resource = '/enrolled_domains';
        this.json = 'enrolledDomains';
        this.single = EnrolledDomain;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function toUnix(date) {
        return Math.floor(date.getTime() / 1000);
    }

    function forbidEdit(rights) {
        var forbitEdit = false;
        if (rights.indexOf(MERCHI.rights.get("canEdit")) === -1) {
            forbitEdit = true;
        }
        return forbitEdit;
    }

    function forbidDelete(rights) {
        var forbitDelete = false;
        if (rights.indexOf(MERCHI.rights.get("canDelete")) === -1) {
            forbitDelete = true;
        }
        return forbitDelete;
    }

    function getRights(data) {
        var return_rights;
        if (data.rights !== undefined && data.rights !== null) {
            return_rights = data.rights;
        } else {
            return_rights = DEFAULT_RIGHTS;
        }
        return return_rights;
    }

    function canEditAttributes(rights) {
        var canEdit = false;
        if (rights.indexOf(MERCHI.rights.get("canEdit")) !== -1) {
            canEdit = true;
        }
        return canEdit;
    }

    function editAttributes(rights) {
        var disableCommand = '';
        if (!canEditAttributes(rights)) {
            disableCommand += " disabled=disabled ";
        }
        return disableCommand;
    }

    function getQuote(productId, quantity, success, error) {
        var request = new Request(),
            data = new Dictionary();
        request.resource('/estimate/');
        request.method('POST');
        data.add('product', productId);
        data.add('quantity', quantity);
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server'};
                }
                success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not get quote'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function getJobQuote(job, success, error) {
        var request = new Request(),
            data = serialise(job)[0];
        request.resource('/specialised-order-estimate/');
        request.method('POST');
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 201) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server'};
                }
                success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not get quote'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function getCurrentUser(success, error, embed) {
        var tokenStringForUser;
        if (loggedInUser && !embed) {
            success(loggedInUser);
            return;
        }
        function haveToken(token) {
            loggedInUser = token.user();
            success(loggedInUser);
        }
        try {
            tokenStringForUser = getCookie('session_token');
        } catch (e) {
            error(e);
        }
        if (!currentSession) {
            currentSession = new Session();
        }
        if (!embed) {
            embed = {};
        }
        if (Boolean(tokenStringForUser)) {
            currentSession.token(tokenStringForUser);
            currentSession.get(haveToken, error,
                               {'user': embed});
        }
    }

    function checkUserInfo(userId, subdomain, name, email, success, error) {
        var request = new Request();

        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server'};
                }
                success(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not recover the entity'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        if (isNaN(userId)) {
            alert('User id is not a number.');
            error();
        } else {
            request.resource('/user-check/' + userId + '/');
            request.method('POST');
            request.contentType('application/x-www-form-urlencoded');
            request.data('subdomain=' + encodeURIComponent(subdomain) +
                         '&name=' + encodeURIComponent(name) +
                         '&email_address=' + encodeURIComponent(email));
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        }
    }

    function getUpdateNotifications(optionsDict) {
        var request = new Request(),
            data = new Dictionary();

        function checkDictKey(optionsDict, key, checker, alerter) {
            var checkObject =
                Object.prototype.hasOwnProperty.call(optionsDict, key) ?
                    optionsDict[key] : [];
            if (checker(checkObject)) {
                return checkObject;
            }
            alerter();
            return null;
        }

        function checkDictKeyForArray(optionsDict, key) {
            return checkDictKey(optionsDict, key, isArray, function () {
                alert(key + " is not an array.");
            });
        }

        function checkDictKeyForDict(optionsDict, key) {
            return checkDictKey(optionsDict, key, isJSON, function () {
                alert(key + " is not a dictionary.");
            });
        }

        function checkDictKeyForFunction(optionsDict, key) {
            return checkDictKey(optionsDict, key, isFunction, function () {
                alert(key + " is not a function.");
            });
        }

        function serlialiseEntitiesArray(optionsDict, key) {
            var entitiesArray = checkDictKeyForArray(optionsDict, key),
                arrayWithObjects = [],
                entityObject,
                entityObjectName,
                newDict,
                i;
            for (i = 0; i < entitiesArray.length; i++) {
                entityObject = entitiesArray[i];
                if (Boolean(entityObject)) {
                    arrayWithObjects.push({type: entityObject.json,
                                           id: entityObject.id()});
                }
            }
            return arrayWithObjects;
        }

        request.resource('/notifications-check-update/');
        request.method('POST');
        data.add('sections',
                 JSON.stringify(checkDictKeyForArray(optionsDict, 'sections')));
        data.add('entities',
                 JSON.stringify(serlialiseEntitiesArray(optionsDict,
                                                        'entities')));
        data.add('notificationTypes',
                 JSON.stringify(checkDictKeyForDict(optionsDict,
                                                    'notificationTypes')));
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server'};
                }
                checkDictKeyForFunction(optionsDict,
                                        'success')(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not recover the entity'};
                }
                checkDictKeyForFunction(optionsDict,
                                        'error')(result);
            }
        }
        function handleError() {
            alert('could not connect to server');
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function checkAndUpdateNotifications(related_object_id, section,
        senderId, success, error) {
        var request = new Request(),
            data = new Dictionary();
        request.resource('/notifications-toast/');
        request.method('POST');
        data.add('related_object_id', related_object_id);
        data.add('section', section);
        data.add('sender_id', senderId);
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server'};
                }
                success(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not recover the entity'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();

        subscriptionManager.subscribe([eventTypes.get('POST')], request.path(),
                                      "POST", handleResponse);
    }

    function escapeHtml(dangerousString) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };
        return String(dangerousString).replace(/[&<>"'/]/g, function (s) {
            return entityMap[s];
        });
    }

    function getQueryStringValue(name) {
        var query = window.location.search.substring(1),
            vars = query.split("&"),
            pair,
            i;
        for (i = 0; i < vars.length; i++) {
            pair = vars[i].split("=");
            if (pair[0] === name) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }

    function getUserIdByEmail(emailAddress, success, error) {
        var request = new Request(),
            data = new Dictionary();
        request.resource('/user-check-email/');
        request.method('POST');
        data.add('email_address', emailAddress);
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Invalid json from server'};
                }
                success(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Email not found.'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function placeOrder(clientId, quantity, product, address, specifications,
                        success, error) {
        var request = new Request(),
            productId = product.id(),
            data = new Dictionary();
        data.add('client_id', clientId);
        data.add('quantity', quantity);
        data.add('product_id', productId);
        data.add('specification_notes', specifications);
        if (address !== null) {
            data = serialise(address, data)[0];
        }
        request.resource('/public-order/');
        request.method('POST');
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Invalid json from server'};
                }
                success(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Unable to create order'};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server'});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    getCurrentUser(id, id, currentUserEmbed);

    return {'roles': roles,
            'roleStrings': roleStrings,
            'roleCssClass': roleCssClass,
            'eventTypes': eventTypes,
            'logout': logout,
            'canEditAttributes': canEditAttributes,
            'editAttributes': editAttributes,
            'forbidEdit': forbidEdit,
            'getRights': getRights,
            'forbidDelete': forbidDelete,
            'DEFAULT_RIGHTS': DEFAULT_RIGHTS,
            'jsonpHandlers': jsonpHandlers,
            'priorityLevels': priorityLevels,
            'URGENT_JOB_PRIORITY': priorityLevels.get('URGENT_JOB_PRIORITY'),
            'HIGH_JOB_PRIORITY': priorityLevels.get('HIGH_JOB_PRIORITY'),
            'MEDIUM_JOB_PRIORITY': priorityLevels.get('MEDIUM_JOB_PRIORITY'),
            'LOW_JOB_PRIORITY': priorityLevels.get('LOW_JOB_PRIORITY'),
            'PhoneNumber': PhoneNumber,
            'Dictionary': Dictionary,
            'phoneNumbers': new PhoneNumbers(),
            'EmailAddress': EmailAddress,
            'emailAddresses': new EmailAddresses(),
            'Address': Address,
            'addresses': new Addresses(),
            'User': User,
            'users': new Users(),
            'Domain': Domain,
            'domains': new Domains(),
            'Theme': Theme,
            'themes': new Themes(),
            'EnrolledDomain': EnrolledDomain,
            'enrolledDomains': new EnrolledDomains(),
            'Company': Company,
            'companies': new Companies(),
            'CompanyInvitation': CompanyInvitation,
            'companyInvitations': new CompanyInvitations(),
            'UserCompany': UserCompany,
            'Category': Category,
            'categories': new Categories(),
            'ComponentTag': ComponentTag,
            'componentTags': new ComponentTags(),
            'Product': Product,
            'products': new Products(),
            'ProductionComment': ProductionComment,
            'Invoice': Invoice,
            'invoices': new Invoices(),
            'Job': Job,
            'jobs': new Jobs(),
            'BidItem': BidItem,
            'BidItems': new BidItems(),
            'Bid': Bid,
            'Bids': new Bids(),
            'Assignment': Assignment,
            'Assignments': new Assignments(),
            'File': MerchiFile,
            'removeUnstoredFiles': removeUnstoredFiles,
            'Shipment': Shipment,
            'Shipments': new Shipments(),
            'CountryTax': CountryTax,
            'CountryTaxes': new CountryTaxes(),
            'getCurrentUser': getCurrentUser,
            'Payment': Payment,
            'Item': Item,
            'Session': Session,
            'serialise': serialise,
            'toJson': toJson,
            'toJsonList': toJsonList,
            'rights': rights,
            'itemTypes': itemTypes,
            'Request': Request,
            'STATUS': STATUS,
            'GSTrate': GSTrate,
            'Notification': Notification,
            'notifications': new Notifications(),
            'SpecificationField': SpecificationField,
            'Specification': Specification,
            'SpecificationsGroup': SpecificationsGroup,
            'SpecificationFieldOption': SpecificationFieldOption,
            'MenuItem': MenuItem,
            'notificationTypes': notificationTypes,
            'paymentTypes': paymentTypes,
            'toUnix': toUnix,
            'id': id,
            'isUndefined': isUndefined,
            'isNull': isNull,
            'isUndefinedOrNull': isUndefinedOrNull,
            'jobStatusProduction': jobStatusProduction,
            'notEmptyArray': notEmptyArray,
            'displayMoney': displayMoney,
            'sortArrayByObjectKey': sortArrayByObjectKey,
            'fromJson': fromJson,
            'fromJsonList': fromJsonList,
            'setSessionCookie': setSessionCookie,
            'getQuote': getQuote,
            'checkAndUpdateNotifications': checkAndUpdateNotifications,
            'escapeHtml': escapeHtml,
            'getQueryStringValue': getQueryStringValue,
            'notificationSectionCodes': notificationSectionCodes,
            'notificationSectionClass': notificationSectionClass,
            'notificationSectionIconClass': notificationSectionIconClass,
            'notificationSection': notificationSection,
            'notificationAvatar': notificationAvatar,
            'fieldTypes': fieldTypes,
            'fieldTypesString': fieldTypesString,
            'getCookie': getCookie,
            'getUserIdByEmail': getUserIdByEmail,
            'placeOrder': placeOrder,
            'platformName': platformName,
            'platformCopyright': platformCopyright,
            'platformIcon': platformIcon,
            'defaultUserAvatar': defaultUserAvatar,
            'platformLogo': platformLogo,
            'subscriptionManager': subscriptionManager,
            'menuItemType': menuItemType,
            'menuItemTypeCodes': menuItemTypeCodes,
            'menuType': menuType,
            'menuTypeCodes': menuTypeCodes,
            'checkUserInfo': checkUserInfo,
            'getJobQuote': getJobQuote,
            'removeObjectFromArrayWithIntegerValue': removeObjectFromArrayWithIntegerValue,
            'shipmentCompanies': shipmentCompanies,
            'generateUUID': generateUUID,
            'getUpdateNotifications': getUpdateNotifications,
            'currentUserEmbed': currentUserEmbed
            };
}
