import {md5} from './md5.js';
import moment from 'moment-timezone';

export function merchi(backendUri, websocketUri) {

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

    function indexOfEntityInArrayByAttribute(attributeName, array, entity) {
      return array.findIndex(function(ent) {
        return entity[attributeName]() === ent[attributeName]();
      });
    }

    function indexOfEntityInArrayById(array, entity) {
      return indexOfEntityInArrayByAttribute('id', array, entity);
    }

    function indexOfEntityInArrayByName(array, entity) {
      return indexOfEntityInArrayByAttribute('name', array, entity);
    }

    function sortArray(array, objectKey, desc) {
        return array ? array.sort(function (a, b) {
            if (desc) {
                return b[objectKey]() - a[objectKey]();
            } else {
                return a[objectKey]() - b[objectKey]();
            }
        }) : [];
    }

    function sortArrayByObjectKey(array, objectKey) {
        return sortArray(array, objectKey);
    }

    function sortArrayByObjectKeyDescending(array, objectKey) {
        return sortArray(array, objectKey, true);
    }

    function sortArrayByObjectKey(array, objectKey) {
        return sortArray(array, objectKey);
    }

    function sortArrayByObjectKeyDescending(array, objectKey) {
        return sortArray(array, objectKey, true);
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
        return Object.assign(oldObject, {});
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
            if (other.__proto__.constructor === Dictionary) {
                other.each(function (name, value) {
                    _this.add(name, value);
                });
            } else {
                for (var property in other) {
                    if (other.hasOwnProperty(property)) {
                        _this.add(property, other[property]);
                    }
                }
            }
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
            return store.has(value);
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
        systemRoles = new Dictionary(),
        allRoles = new Set(),
        roleStrings = new Dictionary(),
        roleCssClass = new Dictionary(),
        rights = new Dictionary(),
        eventTypes = new Dictionary(),
        itemTypes = new Dictionary(),
        jobPriority = new Dictionary(),
        jobStatusPayment = new Dictionary(),
        jobStatusDrafting = new Dictionary(),
        jobStatusProduction = new Dictionary(),
        jobStatusShipment = new Dictionary(),
        priorityLevels = new Dictionary(),
        priorityLevelsOptions = new Dictionary(),
        shipmentCompanies = new Dictionary(),
        paymentTypes = new Dictionary(),
        paymentTypeIds = new Dictionary(),
        productTypes = new Dictionary(),
        productTypesInts = new Dictionary(),
        productTypesSeller = new Dictionary(),
        notificationTypes = new Dictionary(),
        notificationTypesKeys = new Dictionary(),
        notificationSection = new Dictionary(),
        notificationSectionKey = new Dictionary(),
        notificationSectionCodes = new Dictionary(),
        notificationAvatar = new Dictionary(),
        notificationSectionClass = new Dictionary(),
        notificationSectionIconClass = new Dictionary(),
        inventoryStatuses = new Dictionary(),
        themeStatus = new Dictionary(),
        themeFoundation = new Dictionary(),
        fieldTypes = new Dictionary(),
        inputTypes = new Dictionary(),
        fieldTypesString = new Dictionary(),
        menuType = new Dictionary(),
        menuTypeCodes = new Dictionary(),
        menuItemType = new Dictionary(),
        menuItemTypeCodes = new Dictionary(),
        domainTypes = new Dictionary(),
        domainTypesInts = new Dictionary(),
        currentUserEmbed = {'emailAddresses': {},
                            'profilePicture': {},
                            'userCompanies': {"company": {}},
                            'enrolledDomains': {'domain': {}}},
        platformName = 'merchi',
        platformCopyright = 2021,
        platfromDomain = 'merchi.co',
        platfromSellerDomain = 'merchi.me',
        platfromSellerDomainPlus = 'merchi.store',
        backendImgUri = backendUri + 'static/img/',
        platformIconWhite = backendImgUri + 'merchi-monster-white.png',
        platformIcon = backendImgUri + 'merchi-monster-blue.png',
        platformLogo = backendImgUri + 'merchi-master-colour-with-monster.png',
        defaultUserAvatar = backendImgUri + 'default-user-32px.jpg',
        jsonpHandlers = {},
        STATUS = {
            PROD: ['Init', 'Rejected', 'Quoteding', 'Waiting Quote',
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
             'SHIPMENT_EXPECTED_DATE_WARNING', 'SHIPMENT_EXPECTED_DATE_PAST'],
        COMPONENT_BUILDER = 'Component builder',
        SELLER = 'Seller',
        SELLER_PLUS = 'Seller plus',
        SUPPLIER = 'Supplier',
        RESTRICTED_SUPPLIER = 'Restricted supplier';

    /** Main() **/
    roles.add('public', 0);
    roles.add('admin', 1);
    roles.add('sales', 2);
    roles.add('designer', 3);
    roles.add('supplier', 4);
    roles.add('client', 5);
    roles.add('manager', 6);
    roles.add('accountant', 7);
    roles.add('theme editor', 8);

    systemRoles.add("Component builder", 1);

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
    inputTypes.add(9, "image select");
    inputTypes.add(10, "colour picker");
    inputTypes.add(11, "colour select");

    jobStatusPayment.add("INIT", 0);
    jobStatusPayment.add("ISSUED", 1);
    jobStatusPayment.add("OVERDUE", 2);
    jobStatusPayment.add("PARTIAL_PAID", 3);
    jobStatusPayment.add("FULLY_PAID", 4);

    jobStatusDrafting.add("INIT", 0);
    jobStatusDrafting.add("WAIT_DRAFTING", 1);
    jobStatusDrafting.add("CHANGES_REQUESTED", 2);
    jobStatusDrafting.add("DRAFTING_UPLOADED", 3);
    jobStatusDrafting.add("DRAFTING_APPROVED", 4);

    jobStatusPayment.add("INIT", 0);
    jobStatusPayment.add("ISSUED", 1);
    jobStatusPayment.add("OVERDUE", 2);
    jobStatusPayment.add("PARTIAL_PAID", 3);
    jobStatusPayment.add("FULLY_PAID", 4);

    jobStatusDrafting.add("INIT", 0);
    jobStatusDrafting.add("WAIT_DRAFTING", 1);
    jobStatusDrafting.add("CHANGES_REQUESTED", 2);
    jobStatusDrafting.add("DRAFTING_UPLOADED", 3);
    jobStatusDrafting.add("DRAFTING_APPROVED", 4);

    jobStatusProduction.add("INIT", 0);
    jobStatusProduction.add("REJECTED", 1);
    jobStatusProduction.add("QUOTING", 2);
    jobStatusProduction.add("ASSIGN_SENT", 3);
    jobStatusProduction.add("ASSIGN_DEADLINE_REACHED", 4);
    jobStatusProduction.add("ASSIGN_COMPLETE", 5);
    jobStatusProduction.add("QUESTIONING", 6);
    jobStatusProduction.add("COMMENCED", 7);
    jobStatusProduction.add("FINISHED", 8);
    jobStatusProduction.add("SHIPPED", 9);
    jobStatusProduction.add("COMPLETED", 10);

    jobStatusShipment.add("NOT_ASSIGNED", 0);
    jobStatusShipment.add("ASSIGNED", 1);
    jobStatusShipment.add("DISPATCH_SET", 2);
    jobStatusShipment.add("DISPATCH_WARNING", 3);
    jobStatusShipment.add("DISPATCH_LATE", 4);
    jobStatusShipment.add("DISPATCHED", 5);
    jobStatusShipment.add("EXPECTED_RECEIVE_DATE_WARNING", 6);
    jobStatusShipment.add("EXPECTED_RECEIVE_DATE_PAST", 7);
    jobStatusShipment.add("RECEIVED", 8);

    jobPriority.add('urgent', 1);
    jobPriority.add('high', 2);
    jobPriority.add('medium', 3);
    jobPriority.add('low', 4);

    fieldTypesString.add(1, "TEXT_INPUT");
    fieldTypesString.add(2, "SELECT");

    themeStatus = new Dictionary();
    themeStatus.add("NOT_VALID", 1);
    themeStatus.add("VALID_BUT_NOT_UPDATED", 2);
    themeStatus.add("VALID_AND_UPDATED", 3);

    themeFoundation.add("NO_FOUNDATION", 0);
    themeFoundation.add("BOOTSTRAP_3", 1);
    themeFoundation.add("BOOTSTRAP_4", 2);
    themeFoundation.add("BOOTSTRAP_5", 3);

    shipmentCompanies.add(0, 'DHL');
    shipmentCompanies.add(1, 'UPS');
    shipmentCompanies.add(2, 'EMS');
    shipmentCompanies.add(3, 'FedEx');
    shipmentCompanies.add(4, 'Australia Post');
    shipmentCompanies.add(5, 'StarTrack');
    shipmentCompanies.add(6, 'Toll');
    shipmentCompanies.add(7, 'TNT');
    shipmentCompanies.add(8, 'Custom Track Link');
    shipmentCompanies.add(9, 'Aramex');
    shipmentCompanies.add(10, 'realtime express');
    shipmentCompanies.add(11, 'Uber');
    shipmentCompanies.add(12, 'Civic Transport Couriers');

    paymentTypes.add(1, 'Online');
    paymentTypes.add(2, 'PayPal');
    paymentTypes.add(3, 'Bank Transfer');
    paymentTypes.add(4, 'Cash');
    paymentTypes.add(5, 'Cheque');
    paymentTypes.add(6, 'Phone');
    paymentTypes.add(7, 'Credit Card');
    paymentTypes.add(8, 'Utrust');

    paymentTypes.each(function (key, value) {
        paymentTypeIds.add(value, parseInt(key, 10));
    });

    inventoryStatuses.add("DEDUCTED", 0)
    inventoryStatuses.add("CAN_DEDUCT", 1)
    inventoryStatuses.add("NOT_SUFFICIENT", 2)
    inventoryStatuses.add("NO_MATCHING_INVENTORY", 3)

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
    notificationTypes.add("QUOTE_JOB_SUBMITTED", 53);
    notificationTypes.add("QUOTE_JOB_RECEIVED", 54);
    notificationTypes.add("QUOTE_JOB_UPDATED", 55);
    notificationTypes.add("QUOTE_JOB_UPDATED_SENT", 56);
    notificationTypes.add("QUOTE_JOB_APPROVED", 57);
    notificationTypes.add("QUOTE_JOB_APPROVED_SENT", 58);
    notificationTypes.add("JOB_NOTIFICATION_COMMENT", 59);
    notificationTypes.add("PRODUCTION_SHIPPED", 60);
    notificationTypes.add("SELLER_STORE_CREATED", 61);
    notificationTypes.add("WEB_FORM", 62);

    notificationTypes.each(function (key, value) {
        notificationTypesKeys.add(value, key);
    });

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
    notificationSection.add(10, "web form");

    notificationSection.each(function (key, value) {
        notificationSectionKey.add(value, key);
    });

    notificationSectionClass.add(0, "default");
    notificationSectionClass.add(1, "danger");
    notificationSectionClass.add(2, "dark");
    notificationSectionClass.add(3, "success");
    notificationSectionClass.add(4, "warning");
    notificationSectionClass.add(5, "primary");
    notificationSectionClass.add(6, "info");
    notificationSectionClass.add(7, "primary");
    notificationSectionClass.add(8, "dark");
    notificationSectionClass.add(9, "default");
    notificationSectionClass.add(10, "default");

    notificationSectionIconClass.add(0, "fa fa-server");
    notificationSectionIconClass.add(1, "icon_m_single_user");
    notificationSectionIconClass.add(2, "icon_m_job_singular");
    notificationSectionIconClass.add(3, "icon_m_design");
    notificationSectionIconClass.add(4, "icon_m_manufacturing");
    notificationSectionIconClass.add(5, "icon_m_invoice");
    notificationSectionIconClass.add(6, "icon_m_shipping");
    notificationSectionIconClass.add(7, "icon_m_invoice");
    notificationSectionIconClass.add(8, "icon_m_inbox");
    notificationSectionIconClass.add(9, "icon_m_reminder");
    notificationSectionIconClass.add(10, "fa fa-server");

    notificationSection.each(function (key, value) {
        notificationSectionCodes.add(value, parseInt(key, 10));
    });

    productTypes.add(0, 'MOD (made on demand)');
    productTypes.add(1, 'MOQ (minimum or quantity)');
    productTypes.add(2, 'seller');
    productTypes.add(3, 'seller (made on demand)');


    productTypes.each(function (key, value) {
        productTypesInts.add(value, parseInt(key, 10));
    });

    productTypesSeller.add(2, 'seller');
    productTypesSeller.add(3, 'seller (made on demand)');

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

    priorityLevelsOptions.add(1, 'Urgent');
    priorityLevelsOptions.add(2, 'High');
    priorityLevelsOptions.add(3, 'Medium');
    priorityLevelsOptions.add(4, 'Low');

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

    domainTypes.add(0, 'Unrestricted');
    domainTypes.add(1, 'Seller');
    domainTypes.add(2, 'Seller plus');
    domainTypes.add(3, 'Supplier');
    domainTypes.add(4, 'Restricted supplier');
    domainTypes.add(5, 'Domain supplier');

    domainTypes.each(function (key, value) {
        domainTypesInts.add(value, parseInt(key, 10));
    });

    /** Key functions, fromJson, Request **/
    function forEachProperty(obj, procedure) {
        obj._properties.each(function (property) {
            // elem in _propertiesSet is array
            // 0 is name, 1 is type
            procedure(property[0], property[1]);
        });
    }

    function fromJson(model, json, options) {
        var defaults = {makesDirty: true};
        options = Object.assign({}, defaults, options);
        forEachProperty(model, function (propName, Type) {
            try {
                var received = json[propName],
                    parsed;

                if (!Type || typeof received === 'number') {
                    // Prop is untyped or only id received
                    model[propName](received, {makesDirty: options.makesDirty});
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
                    model[propName](parsed, {makesDirty: options.makesDirty});
                }
            } catch (ignore) {
            }
        });
        model.rights = json.rights;
        return model;
    }

    function fromJsonList(obj, json, options) {
        var result = [],
            list,
            i,
            single;

        var defaults = {makesDirty: true};
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
                } else if (!isUndefinedOrNull(value)) {
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
                            json[propNameCamel] = dict;
                        } else {
                            json[propNameCamel] = [];
                        }
                    } else {
                        // Embed Object received
                        dict = toJson(value);
                        json[propNameCamel] = dict;
                    }
                }
            } catch (ignore) {
            }
        });
        json.rights = model.rights;
        return json;
    }

    function entAsBlank(obj) {
        /* Return a copy of obj with only obj.id() set */
        var newEnt = Object.create(Object.getPrototypeOf(obj));
        Object.assign(newEnt, obj);
        function copyProp(propertyName, propertyType) {
            addPropertyTo(newEnt, propertyName, propertyType);
            if (propertyName === 'id') {
                newEnt[propertyName](obj.id());
            } else {
                newEnt["_" + propertyName] = undefined;
            }
        }
        forEachProperty(obj, copyProp);
        return newEnt;
    }

    function cleanEntities(entityArray) {
        var newArray = [];
        entityArray.map(function (entity) {
            newArray.push(entAsBlank(entity));
        });
        return newArray;
    };

    function copyEnt(obj) {
       var newEnt = Object.create(Object.getPrototypeOf(obj));
       Object.assign(newEnt, obj);
       function copyProp(propertyName, propertyType) {
          var propertyValue = obj[propertyName](),
              newValue;
          addPropertyTo(newEnt, propertyName, propertyType);
          if (!!propertyType) {
              if (!!propertyValue) {
                if (propertyValue instanceof Array) {
                  newValue = propertyValue.map(copyEnt);
                } else {
                  newValue = copyEnt(propertyValue);
                }
              }
          } else {
            newValue = propertyValue;
          }
          newEnt[propertyName](newValue);
       }
       forEachProperty(obj, copyProp);
       return newEnt;
    }

    function copyEntIfNotNullOrUndefined(obj) {
        const entCopy = obj ? copyEnt(obj) : null;
        if (entCopy) {
            entCopy.id(null);
        }
        return entCopy; 
    }

    function updateEntNonEmbeddableAttrbibutes(ent, newEnt) {
        function notArrayOrEmbeddableAttr(attrVal) {
            return attrVal && !Array.isArray(attrVal) && !attrVal.json;
        }
        function copyProp(propertyName, propertyType) {
            var entAttr = ent[propertyName](),
                newEntAttr = newEnt[propertyName]();
            if (notArrayOrEmbeddableAttr(entAttr) &&
                notArrayOrEmbeddableAttr(newEntAttr)) {
                ent[propertyName](newEntAttr);
            }
       }
       forEachProperty(newEnt, copyProp);
       return ent;
    }

    function updateEntAttributes(ent, newEnt, attrs) {
        var newAttributesValues = {},
            updatedEnt = updateEntNonEmbeddableAttrbibutes(ent, newEnt),
            i;
        for (i = 0; i < attrs.length; i++) {
            var attributeName = attrs[i];
            updatedEnt[attributeName](newEnt[attributeName]());
        }
       return updatedEnt;
    }

    function ignoreAttributesUpdateEnt(ent, newEnt, ignoredAttrs) {
        /* Update an entity with new values from an updated entity
           but ignore specified attributes
        */
        var newAttributesValues = {},
            updatedEnt = newEnt,
            i;
        for (i = 0; i < ignoredAttrs.length; i++) {
            var attributeName = ignoredAttrs[i];
            updatedEnt[attributeName](ent[attributeName]());
        }
       return updatedEnt;
    }

    function serialise(obj, existing, prefix, files, options) {
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
                else
                {
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
                nested,
                amountAdded;
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
                    var initialCount = result.count();
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

    function addPropertyTo(obj, propertyName, Type) {
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

        // So Unitix Model has inbult _properties which is a Set
        // _properties indicate the key(propertyName) and type()
        // But a real property is in  Model._+propertyName
        // and its accessor is Model.propertyName(value)
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

    function Request() {

        var server = window.merchiBackendUri ? window.merchiBackendUri :
                                               backendUri,
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
            if (Boolean(window.currentSession) &&
                Boolean(window.currentSession.token())) {
                this.query().add('session_token',
                                 window.currentSession.token());
            }
            if (this.query().count() > 0) {
                url += '?' + this.query().toUriEncoding();
            }
            return url;
        };

        this.jsonpUrl = function (handlerName) {
            var url = '';
            url += this.server();
            url += '/';
            url += this.version();
            url += '/jsonp/?method=' + encodeURIComponent(this.method());
            url += '&resource=' + encodeURIComponent(this.resource().
                substring(1));
            url += '&jsonp=' + encodeURIComponent(handlerName);
            if (Boolean(window.currentSession) &&
                Boolean(window.currentSession.token())) {
                this.query().add('session_token',
                                 window.currentSession.token());
            }
            this.query().each(function (name, value) {
                url += '&' + name + '=' + encodeURIComponent(value);
            });
            url += this.data().toUriEncoding();
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
                self = this,
                handler;
            jsonpHandlers[rand] = function (status, response) {
                delete jsonpHandlers[handlerName];
                document.body.removeChild(scriptTag);
                status = parseInt(status, 10);
                if (isNaN(status) || status === 0 || status > 399) {
                    handler = self.errorHandler();
                } else {
                    handler = self.responseHandler();
                }
                handler(status, JSON.stringify(response));
            };
            scriptTag.setAttribute('type', 'text/javascript');
            scriptTag.setAttribute('src', this.jsonpUrl(handlerName));
            document.body.appendChild(scriptTag);
        };

        this.sendXMLHttpRequest = function () {
            var self = this,
                transport = new XMLHttpRequest(),
                allData;
            function handleDone() {
                if (transport.status === 0 || transport.status > 399) {
                    self.errorHandler()(transport.status,
                            transport.responseText);
                } else {
                  self.responseHandler()(transport.status,
                          transport.responseText);
                }
            }
            transport.addEventListener('load', handleDone);
            transport.addEventListener('error', handleDone);
            transport.open(this.usableMethod(), this.url(), true);
            if (this.username() !== null) {
                transport.setRequestHeader('Authorization', 'Basic ' +
                    btoa(this.username() + ':' + this.password()));
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
                    result = {message: 'could not recover the entity',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError(status, data) {
            var result = '';
            try {
                result = JSON.parse(data);
            } catch (err) {
                result = {message: 'could not connect to server',
                          errorCode: 0};
            }
            error(status, result);
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
                    result = {message: 'could not delete the entity',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError(status, data) {
            var result = '';
            try {
                result = JSON.parse(data);
            } catch (err) {
                result = {message: 'could not connect to server',
                          errorCode: 0};
            }
            error(status, result);
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }


    function getOne(options) {
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
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    error({message: 'problem getting response from server'});
                    return;
                }
                options.success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (err) {
                    result = {message: 'could not get the entity'};
                }
                error(result);
            }
        }
        function handleError(status, data) {
            var result = '';
            try {
                result = JSON.parse(data);
            } catch (err) {
                result = {message: 'could not connect to server',
                          errorCode: 0};
            }
            error(status, result);
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
        if (!options.withRights) {
            request.query().add('skip_rights', 'y');
        }
        function handleResponse(status, body) {
            var result = '';
            if (status === 201) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    message = 'problem getting response from server';
                    options.error({message: message,
                                   errorCode: 0});
                    return;
                }
                options.success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (err) {
                    result = {message: 'could not create the resource',
                              errorCode: 0};
                }
                options.error(status, result);
            }
        }
        function handleError(status, data) {
            var result = '';
            try {
                result = JSON.parse(data);
            } catch (err) {
                result = {message: 'could not connect to server',
                          errorCode: 0}
            }
            options.error(status, result);
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
        if (options.cartToken) {
            request.query().add('cart_token', options.cartToken);
        }
        if (!options.withRights) {
            request.query().add('skip_rights', 'y');
        }
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    var message = 'problem getting response from server';
                    options.error(status, {message: message,
                                           errorCode: 0});
                    return;
                }
                options.success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (err) {
                    result = {message: 'could not edit the entity',
                              errorCode: 0};
                }
                options.error(status, result);
            }
        }
        function handleError(status, data) {
            var result = '';
            try {
                result = JSON.parse(data);
            } catch (err) {
                result = {message: 'could not connect to server',
                          errorCode: 0};
            }
            options.error(status, result);
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
                    error({message: 'problem getting response from server',
                           errorCode: 0});
                    return;
                }
                success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (err) {
                    result = {message: 'could not get the list',
                              errorCode: 0};
                }
                error(result);
            }
        }

        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }

        request.resource(resource + '/').method('GET');
        request.responseHandler(getListResponseHandler)
            .errorHandler(handleError);

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
        if (parameters.inbound) {
            request.query().add('inbound',
                                JSON.stringify(parameters.inbound));
        }
        if (parameters.domainRoles) {
            request.query().add('domain_roles', parameters.domainRoles);
        }
        if (parameters.domainTypes) {
            request.query().add('domain_types', parameters.domainTypes);
        }
        if (parameters.productTypes) {
            request.query().add('product_types', parameters.productTypes);
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
        if (notEmpty(parameters.companyId)) {
            request.query().add('company_id', parameters.companyId);
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
        if (notEmpty(parameters.excludeDomains)) {
            request.query().add('excludeDomains',
                                parameters.excludeDomains);
        }
        if (notEmpty(parameters.includeOnly)) {
            request.query().add('include_only', parameters.includeOnly);
        }
        if (notEmpty(parameters.orClientId)) {
            request.query().add('include_only', parameters.includeOnly);
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
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'number');
        addPropertyTo(this, 'code');
        addPropertyTo(this, 'localFormatNumber');
        addPropertyTo(this, 'internationalFormatNumber');

    }

    function EmailAddress() {
        this.resource = '/email_addresses';
        this.json = 'emailAddress';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'emailAddress');
    }

    function EmailCounter() {
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

    function Address() {
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

    function Bank() {
        this.resource = '/banks';
        this.json = 'bank';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'bankName');
        addPropertyTo(this, 'accountNumber');
        addPropertyTo(this, 'accountName');
        addPropertyTo(this, 'bsb');
        addPropertyTo(this, 'swiftCode');
        addPropertyTo(this, 'iban');
        addPropertyTo(this, 'bankCode');
        addPropertyTo(this, 'bankAddress', Address);
        addPropertyTo(this, 'company', Companies);
    }

    function Backup() {
        this.resource = '/backups';
        this.json = 'backup';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'file', MerchiFile);

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };
    }

    function MerchiFile() {
        this.resource = '/files';
        this.json = 'file';
        this.temporaryId = generateUUID();

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

    function MenuItem() {
        this.resource = '/menu_items';
        this.json = 'menuItem';
        this.temporaryId = generateUUID();

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
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'menuHandle');
        addPropertyTo(this, 'menuType');
        addPropertyTo(this, 'menuItems', MenuItem);

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

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };
    }

    function DomainInvitation() {
        this.resource = '/domain_invitations';
        this.json = 'domainInvitation';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'userName');
        addPropertyTo(this, 'userEmail');
        addPropertyTo(this, 'role');
    }

    function Domain() {
        this.resource = '/domains';
        this.json = 'domain';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'apiSecret');
        addPropertyTo(this, 'domain');
        addPropertyTo(this, 'domainType');
        addPropertyTo(this, 'activeThemeId');
        addPropertyTo(this, 'activeTheme', Theme);
        addPropertyTo(this, 'subDomain');
        addPropertyTo(this, 'theme');
        addPropertyTo(this, 'logoUrl');
        addPropertyTo(this, 'smsName');
        addPropertyTo(this, 'emailDomain');
        addPropertyTo(this, 'conversionTrackingCode');
        addPropertyTo(this, 'newConversionTrackingCode');
        addPropertyTo(this, 'newGlobalTrackingCode');
        addPropertyTo(this, 'logo', MerchiFile);
        addPropertyTo(this, 'favicon', MerchiFile);
        addPropertyTo(this, 'company', Company);
        addPropertyTo(this, 'menus', Menu);
        addPropertyTo(this, 'showDomainPublicly');
        addPropertyTo(this, 'enableNotifications');
        addPropertyTo(this, 'enableEmailNotifications');
        addPropertyTo(this, 'enableSmsNotifications');
        addPropertyTo(this, 'themes', Theme);
        addPropertyTo(this, 'supplyProducts', SupplyDomain);
        addPropertyTo(this, 'domainInvitations', DomainInvitation);
        addPropertyTo(this, 'jobsAssignees', User);
        addPropertyTo(this, 'tags', DomainTag);

        this.create = function (success, error, embed, as_domain) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    files: enumerateFiles(data[1]),
                    as_domain: as_domain,
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.get = function (success, error, embed, withRights) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error,
                    embed: embed,
                    withRights: withRights});
        };

        this.invite = function (invitationData, success, error, embed) {
            var request = new Request(),
                data = new Dictionary(),
                self = this;
                id = self.id();

            function handleResponse(status, result) {
                var newInvitation = new DomainInvitation(),
                    invitation = JSON.parse(result),
                    invitations = self.domainInvitations() ?
                      self.domainInvitations() : [];
                newInvitation.id(invitation.id);
                newInvitation.userEmail(invitation.userEmail);
                newInvitation.userName(invitation.userName);
                newInvitation.role(invitation.role);
                invitations.push(newInvitation);
                self.domainInvitations(invitations);
                success(self);
            }

            data.add("inviteUserEmail", invitationData.emailAddress);
            data.add("inviteUserName", invitationData.userName);
            data.add("domainId", id);
            data.add("domainRole", invitationData.role);
            request.resource('/domain_invite/').method('POST');
            request.data().merge(data);
            request.responseHandler(handleResponse);
            request.errorHandler(error);
            request.send();
        }

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

        this.patch = function (success, error, embed, as_domain) {
            var data = data = serialise(this)[0],
                self = this;
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
            this.patch(success, error,
                       serialise(this, undefined, undefined,
                                 undefined, {excludeOld: true})[0], embed);
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

        this.domainLogoUrl = function () {
            var logo = this.logo();
            return logo && logo.viewUrl() ? logo.viewUrl() : null;
        }

        this.faviconLogoUrl = function () {
            var favicon = this.favicon();
            return favicon && favicon.viewUrl() ? favicon.viewUrl() : null;
        }

        this.isDomainType = function (typeName) {
            return this.domainType() === domainTypesInts.get(typeName);
        }

        this.isSellerDomain = function () {
            return this.isDomainType(SELLER);
        }

        this.isSellerOrSellerPlusDomain = function () {
            return this.isSellerDomain() || this.isDomainType(SELLER_PLUS);
        }

        this.isSupplierOrRestrictedSupplierDomain = function () {
            return this.isDomainType(SUPPLIER) ||
                this.isDomainType(RESTRICTED_SUPPLIER);
        }

        this.isUnrestricted = function () {
            return this.domainType() === domainTypesInts.get('Unrestricted');
        }
    }

    function ExchangeRate() {
        this.resource = '/exchange_rates';
        this.json = 'exchangeRate';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'fromCurrency');
        addPropertyTo(this, 'toCurrency');
        addPropertyTo(this, 'rate');
        addPropertyTo(this, 'lastUpdated');

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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error});
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };
    }

    function Theme() {
        this.resource = '/themes';
        this.json = 'theme';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'description');
        addPropertyTo(this, 'foundation');
        addPropertyTo(this, 'public');
        addPropertyTo(this, 'lastUpdated');

        addPropertyTo(this, 'featureImage', MerchiFile);
        addPropertyTo(this, 'images', MerchiFile);
        addPropertyTo(this, 'cssImageFiles', MerchiFile);
        addPropertyTo(this, 'pages', Page);

        addPropertyTo(this, 'headerTemplate');
        addPropertyTo(this, 'headerHtml');
        addPropertyTo(this, 'headerJs');
        addPropertyTo(this, 'footerTemplate');
        addPropertyTo(this, 'footerHtml');
        addPropertyTo(this, 'footerJs');
        addPropertyTo(this, 'indexPageTemplate');
        addPropertyTo(this, 'indexHtml');
        addPropertyTo(this, 'indexJs');
        addPropertyTo(this, 'invoicesPageTemplate');
        addPropertyTo(this, 'invoicesHtml');
        addPropertyTo(this, 'invoicesJs');
        addPropertyTo(this, 'productsPageTemplate');
        addPropertyTo(this, 'productsHtml');
        addPropertyTo(this, 'productsJs');
        addPropertyTo(this, 'domainInvitePageTemplate');
        addPropertyTo(this, 'domainInviteHtml');
        addPropertyTo(this, 'domainInviteJs');
        addPropertyTo(this, 'resetPasswordPageTemplate');
        addPropertyTo(this, 'passwordResetHtml');
        addPropertyTo(this, 'passwordResetJs');
        addPropertyTo(this, 'passwordChangePageTemplate');
        addPropertyTo(this, 'passwordChangeHtml');
        addPropertyTo(this, 'passwordChangeJs');
        addPropertyTo(this, 'jobsPageTemplate');
        addPropertyTo(this, 'jobsHtml');
        addPropertyTo(this, 'jobsJs');
        addPropertyTo(this, 'jobDraftingPageTemplate');
        addPropertyTo(this, 'jobDraftingHtml');
        addPropertyTo(this, 'jobDraftingJs');
        addPropertyTo(this, 'jobQuoteRequestedPageTemplate');
        addPropertyTo(this, 'jobQuoteRequestedHtml');
        addPropertyTo(this, 'jobQuoteRequestedJs');
        addPropertyTo(this, 'draftPreviewPageTemplate');
        addPropertyTo(this, 'draftPreviewHtml');
        addPropertyTo(this, 'draftPreviewJs');
        addPropertyTo(this, 'invoicePageTemplate');
        addPropertyTo(this, 'invoiceHtml');
        addPropertyTo(this, 'invoiceJs');
        addPropertyTo(this, 'userProfilePageTemplate');
        addPropertyTo(this, 'userProfileHtml');
        addPropertyTo(this, 'userProfileJs');
        addPropertyTo(this, 'companyProfilePageTemplate');
        addPropertyTo(this, 'companyProfileHtml');
        addPropertyTo(this, 'companyProfileJs');
        addPropertyTo(this, 'productPageTemplate');
        addPropertyTo(this, 'productHtml');
        addPropertyTo(this, 'productJs');
        addPropertyTo(this, 'invoicePaidPageTemplate');
        addPropertyTo(this, 'invoicePaidHtml');
        addPropertyTo(this, 'invoicePaidJs');
        addPropertyTo(this, 'loginPageTemplate');
        addPropertyTo(this, 'loginPageHtml');
        addPropertyTo(this, 'loginPageJs');
        addPropertyTo(this, 'errorPageTemplate');
        addPropertyTo(this, 'errorPageHtml');
        addPropertyTo(this, 'errorPageJs');

        addPropertyTo(this, 'footerError');
        addPropertyTo(this, 'headerError');
        addPropertyTo(this, 'indexPageError');
        addPropertyTo(this, 'invoicesPageError');
        addPropertyTo(this, 'productsPageError');
        addPropertyTo(this, 'domainInvitePageError');
        addPropertyTo(this, 'resetPasswordPageError');
        addPropertyTo(this, 'passwordChangePageError');
        addPropertyTo(this, 'jobsPageError');
        addPropertyTo(this, 'jobDraftingPageError');
        addPropertyTo(this, 'jobQuoteRequestedPageError');
        addPropertyTo(this, 'draftPreviewPageError');
        addPropertyTo(this, 'invoicePageError');
        addPropertyTo(this, 'userProfilePageError');
        addPropertyTo(this, 'companyProfilePageError');
        addPropertyTo(this, 'productPageError');
        addPropertyTo(this, 'invoicePaidPageError');
        addPropertyTo(this, 'loginPageError');
        addPropertyTo(this, 'errorPageError');

        addPropertyTo(this, 'mainCssErrorMessage');
        addPropertyTo(this, 'mainCssStatus');
        addPropertyTo(this, 'mainCss');
        addPropertyTo(this, 'mainCssTemplateEditing');
        addPropertyTo(this, 'mainCssTemplateUsing');

        addPropertyTo(this, 'emailCssErrorMessage');
        addPropertyTo(this, 'emailCssStatus');
        addPropertyTo(this, 'emailCss');
        addPropertyTo(this, 'emailCssTemplateEditing');
        addPropertyTo(this, 'emailCssTemplateUsing');

        addPropertyTo(this, 'author', User);
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'defaultForDomainType');

        this.create = function (success, error, embed, as_domain) {
            var self = this,
                data = serialise(this);
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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }

            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error,
                    embed: embed});
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

        this.canBeActivated = function () {
            var validStatus = themeStatus.get("VALID_BUT_NOT_UPDATED");
            return this.mainCssStatus() >= validStatus &&
                this.emailCssStatus() >= validStatus;
        };

        this.isActiveOnDomain = function (domainId) {
            var domain = this.domain();
            return domain && domain.id() === parseInt(domainId, 10) &&
                domain.activeThemeId() === this.id();
        };

        this.getPageBySlug = function (slug) {
            var pages = this.pages() ? this.pages() : [],
                i;
            for (i = 0; i < pages.length; i++) {
                var page = pages[i];
                if (page.slug() === slug) {
                    return page;
                }
            }
            return null;
        };

        this.updateTemplateByName = function (name, text) {
            var page = this.getPageBySlug(name);
            if (page) {
                page.template(text);
            } else {
                this[name](text);
            }
        };
    }

    function SystemRole() {
        this.resource = '/system_roles';
        this.json = 'systemRole';

        addPropertyTo(this, 'role');
    }

    function User() {
        this.resource = '/users';
        this.json = 'user';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'password');
        addPropertyTo(this, 'resetToken');
        addPropertyTo(this, 'created');
        addPropertyTo(this, 'timezone');
        addPropertyTo(this, 'preferredLanguage');
        addPropertyTo(this, 'isSuperUser');
        addPropertyTo(this, 'systemRoles', SystemRole);
        addPropertyTo(this, 'enableCrashReports');
        addPropertyTo(this, 'enableClientEmails');
        addPropertyTo(this, 'enableInvoiceReminders');
        addPropertyTo(this, 'phoneNumbers', PhoneNumber);
        addPropertyTo(this, 'emailAddresses', EmailAddress);
        addPropertyTo(this, 'addresses', Address);
        addPropertyTo(this, 'userCompanies', UserCompany);
        addPropertyTo(this, 'enrolledDomains', EnrolledDomain);
        addPropertyTo(this, 'profilePicture', MerchiFile);
        /* products that a supplier can produce */
        addPropertyTo(this, 'products', Product);
        /* products that a user has saved for future reference */
        addPropertyTo(this, 'savedProducts', Product);

        this.create = function (success, error, embed, as_domain) {
            var self = this,
                data = serialise(self);
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

        this.publicCreate = function (success, error) {
            var data = serialise(this),
                self = this,
                request = new Request(),
                result = '',
                jsonBody;
            request.data().merge(data[0]);
            request.resource('/public-user-create/');
            request.method('POST');
            function handleResponse(status, body) {
                if (status === 201) {
                    try {
                        jsonBody = JSON.parse(body);
                        result = fromJson(self, jsonBody[self.json]);
                        success(result);
                    } catch (e) {
                        result = {message: 'invalid json from server'};
                        error(status, result);
                    }
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Unable to create user.'};
                    }
                    error(status, result);
                }
            }
            function handleError(status, body) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Invalid json from server',
                              errorCode: 0};
                }
                error(status, result);
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };

        this.patch = function (success, error, embed, asDomain) {
            var self = this,
                data = serialise(self, undefined, undefined, undefined,
                                 {excludeOld: true})[0];
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      as_domain: asDomain,
                      success: handleResponse,
                      error: error,
                      data: data,
                      embed: embed});
        };

        this.update = function (success, error, embed) {
            this.patch(success, error, embed);
        };

        this.isRegistered = function() {
            var id = this.id();
            return !isUndefinedOrNull(id) && id > 0;
        }

        this.enrolledDomainByDomainId = function (domainId) {
            var i, enrolledDomains = this.enrolledDomains();
            for (i = 0; i < enrolledDomains.length; i++) {
                var domain = enrolledDomains[i].domain();
                if (domain && domain.id() === domainId) {
                    return enrolledDomains[i];
                }
            }
            return null;
        }

        this.roleInDomain = function (domainId) {
            var enrolledDomains = this.enrolledDomainByDomainId(domainId);
            return enrolledDomains ? enrolledDomains.role() : roles.get("public");
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

        this.isJobsAssignee = function (domainId) {
            var enrolledDomain = this.enrolledDomainByDomainId(domainId);
            return enrolledDomain ? enrolledDomain.isJobsAssignee() : false;
       };

        this.isAdmin = function (domainId) {
            return this.hasAuthority(domainId, [roles.get('admin')]);
        };

        this.isAdminOrManager = function (domainId) {
            var managerRole = roles.get('manager'),
                adminRole = roles.get('admin');
            return this.hasAuthority(domainId, [managerRole, adminRole]);
        };

        this.canEditInvoice = function (domainId) {
            var managerRole = roles.get('manager'),
                adminRole = roles.get('admin'),
                accountantRole = roles.get('accountant');
            return this.hasAuthority(
                domainId, [managerRole, adminRole, accountantRole]);
        }


        this.canEditTheme = function (domainId) {
            var managerRole = roles.get('manager'),
                adminRole = roles.get('admin'),
                themeRole = roles.get('theme editor');
            return this.hasAuthority(
                domainId, [managerRole, adminRole, themeRole]);
        }

        this.allRoles = function () {
            var rolesSet = new Set(), i,
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

        this.hasRoleInAnyDomain = function (rolesArray) {
            var i, hasRole = false;
            this.allRoles().each(function(roleInt) {
                for (i = 0; i < rolesArray.length; i++) {
                    if (roleInt === rolesArray[i]) {
                        hasRole = true;
                    }
                }
            });
            return hasRole;
        }

        this.domainsByRoles = function (rolesArray) {
            /* takes an array of roles and returns an array of domains where
               the user has one of the provided roles.
            */
            var enrolledDomains = this.enrolledDomains() ?
                    this.enrolledDomains() : [],
                domains = [],
                domain,
                i;
            for (i = 0; i < enrolledDomains.length; i++) {
                domain = enrolledDomains[i].domain();
                if (domain && this.hasAuthority(domain.id(), rolesArray)) {
                    domains.push(domain);
                }
            }
            return domains;
        }

        this.update = function (success, error, embed) {
            this.patch(success, error,
                       serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0], embed);
        };

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

        this.inDomain = function (domainId) {
            var i,
                domain,
                userDomains = this.enrolledDomains();
            for (i = 0; i < userDomains.length; i += 1) {
                domain = userDomains[i].domain();
                if (domain && domain.id() === parseInt(domainId, 10)) {
                    return true;
                }
            }
            return false;
        };

        this.managedDomains = function () {
            var domains = [],
                i,
                enrolment,
                userDomains = this.enrolledDomains();
            for (i = 0; i < userDomains.length; i += 1) {
                enrolment = userDomains[i];
                if (enrolment.role() === roles.get('admin') ||
                        enrolment.role() === roles.get('manager')) {
                    domains.push(enrolment.domain());
                }
            }
            return domains;
        }

        this.supplierDesignerDomains = function () {
            var domains = [],
                i,
                enrolment,
                userDomains = this.enrolledDomains();
            for (i = 0; i < userDomains.length; i += 1) {
                enrolment = userDomains[i];
                if (enrolment.role() === roles.get('designer') ||
                        enrolment.role() === roles.get('supplier')) {
                    domains.push(enrolment.domain());
                }
            }
            return domains;
        }

        this.hasSystemRole = function (systemRole) {
            var systemRoles = this.systemRoles() ? this.systemRoles() : [],
                i;
            for (i = 0; i < systemRoles.length; i++) {
                if (systemRoles[i].role() === systemRole) {
                    return true;
                }
            }
            return false;
        };

        this.isPlatformStaff = function() {
            return this.isSuperUser() || this.hasSystemRole();
        };

        this.isComponentBuilder = function () {
            return this.hasSystemRole(systemRoles.get(COMPONENT_BUILDER));
        };

        this.indexOfSystemRole = function (systemRole) {
            var systemRoles = this.systemRoles() ? this.systemRoles() : [];
            return systemRoles.findIndex(function(ent) {
                return systemRole === ent.role();
            });
        };

        this.userLocalTime = function (time) {
            return moment(time).tz(this.timezone()).toDate();
        };

        this.userLocalTimeUnix = function (time) {
            return moment(time).tz(this.timezone()).unix();
        };

        this.userLocalTimeMoment = function (time) {
            return moment(time).tz(this.timezone());
        };

        this.userLocalTimeFormat = function (unixTix, formaString) {
            var format = formaString ?
                formaString : 'ddd Do MMM YY';
            return moment(unixTix).tz(this.timezone()).format(format);
        }

        this.profilePictureUrl = function (size) {
            var email = this.emailAddresses() ?
                        this.emailAddresses()[0].emailAddress().toLowerCase() :
                        'this address does not exist. md5 collision unlikely';
            size = size || 50;
            if (this.profilePicture()) {
                return String(this.profilePicture().viewUrl());
            }
            return 'https://www.gravatar.com/avatar/' +
                md5(email) + '?d=mm&s=' + size;
        };

        this.primaryEmailAddressEntity = function () {
            var emails = this.emailAddresses();
            return emails && emails[0] ? emails[0] : null;
        }

        this.primaryEmailAddress = function () {
            var email = this.primaryEmailAddressEntity();
            return email ? email.emailAddress() : null;
        };

        this.primaryPhoneNumberEntity = function () {
            var numbers = this.phoneNumbers();
            return numbers && numbers[0] ? numbers[0] : null;
        }

        this.primaryPhoneNumber = function () {
            var primary = this.primaryPhoneNumberEntity();
            return primary ? primary.internationalFormatNumber() : null;
        };

        this.primaryCompany = function () {
            var companies = this.userCompanies();
            return companies && companies[0] ?
              companies[0].company() : null;
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

        this.findCompanyInUserCompanies = function (company) {
            var companies = this.userCompanies() ? this.userCompanies() : [],
                i;
            for (i = 0; i < companies.length; i++) {
                var c = companies[i].company();
                if (c.id() === company.id()) {
                    return companies[i];
                }
            }
            return null;
        }

        this.isInCompany = function (company) {
            return Boolean(this.findCompanyInUserCompanies(company));
        }

        this.isCompanyAdmin = function (company) {
            return this.isInCompany(company) &&
                this.findCompanyInUserCompanies(company).isAdmin();
        }
    }

    function EnrolledDomain() {
        this.resource = '/enrolled_domains';
        this.json = 'enrolledDomain';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'role');
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'isJobsAssignee');


        this.create = function (success, error, embed, as_domain) {
            var self = this,
                data = serialise(self);
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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error});
        };

        this.patch = function (success, error, embed, asDomain) {
            var self = this,
                data = serialise(self, undefined, undefined, undefined,
                                 {excludeOld: true})[0];
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      as_domain: asDomain,
                      success: handleResponse,
                      error: error,
                      data: data,
                      embed: embed});
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };
    }

    function UserCompany() {
        this.resource = '/user_companies';
        this.json = 'userCompany';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'isAdmin');
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'company', Company);
    }

    function Session() {
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
            function handleResponse(status, body) {
                var result = JSON.parse(body);
                success(fromJson(self, result[self.json]));
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

    function getCookie(name, defaultValue) {
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
        if (isUndefined(defaultValue)) {
            throw 'no such cookie present';
        } else {
            return defaultValue;
        }
    }

    function getCartCookie(storeId) {
        var cart = new Cart(),
            idAndToken = getCookie('cart-' + String(storeId), null);
        return idAndToken ? idAndToken.split(',') : null;
    }

    function setSessionCookie(name, value, domain) {
        var cookie = name + '=' + value;
        if (!!domain) {
            // remove port, if it exists
            var n = domain.indexOf(':');
            domain = domain.substring(0, n != -1 ? n : domain.length);
            // remove trailing slash and path, if they exists
            n = domain.indexOf('/');
            domain = domain.substring(0, n != -1 ? n : domain.length);
            cookie += '; Domain=' + domain;
        }
        cookie += '; path=/';
        document.cookie = cookie;
    }

    function setCartCookie(storeId, cart, domain) {
        var cookieValue = cart ? cart.id() + ',' + cart.token() : '';
        setSessionCookie('cart-' + String(storeId), cookieValue, domain);
    }

    function logout() {
        if (Boolean(window.currentSession)) {
            window.currentSession.remove(id, id);
            window.loggedInUser = null;
            window.currentSession = null;
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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error});
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };

        this.wrapedRepresentation = function () {
            var representation = this.taxName();
            if (this.country()) {
                representation += " (" + this.country() + ")";
            }
            return representation;
        };
    }


    function CompanyInvitation() {
        this.resource = '/company_invitations';
        this.json = 'companyInvitation';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'userName');
        addPropertyTo(this, 'userEmail');
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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error});
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };

    }

    function Company() {
        this.resource = '/companies';
        this.json = 'company';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'website');
        addPropertyTo(this, 'country');
        addPropertyTo(this, 'logo', MerchiFile);
        addPropertyTo(this, 'defaultCurrency');
        addPropertyTo(this, 'taxNumber');
        addPropertyTo(this, 'taxNumberType');
        addPropertyTo(this, 'defaultTaxType', CountryTax);
        addPropertyTo(this, 'taxTypes', CountryTax);
        addPropertyTo(this, 'paypalAccount');
        addPropertyTo(this, 'paypalPassword');
        addPropertyTo(this, 'paypalSignature');
        addPropertyTo(this, 'isPaypalValid');
        addPropertyTo(this, 'utrustApiKey');
        addPropertyTo(this, 'utrustWebhookKey');
        addPropertyTo(this, 'acceptUtrust');
        addPropertyTo(this, 'isUtrustValid');
        addPropertyTo(this, 'stripePublishableKey');
        addPropertyTo(this, 'stripeApiKey');
        addPropertyTo(this, 'isStripeValid');
        addPropertyTo(this, 'acceptStripe');
        addPropertyTo(this, 'acceptPaypal');
        addPropertyTo(this, 'acceptBankTransfer');
        addPropertyTo(this, 'acceptPhonePayment');
        addPropertyTo(this, 'ownershipUnconfirmed');
        addPropertyTo(this, 'userCompanies', UserCompany);
        addPropertyTo(this, 'phoneNumbers', PhoneNumber);
        addPropertyTo(this, 'paymentPhoneNumbers', PhoneNumber);
        addPropertyTo(this, 'emailAddresses', EmailAddress);
        addPropertyTo(this, 'addresses', Address);
        addPropertyTo(this, 'banks', Bank);
        /* products that a company has saved for future reference */
        addPropertyTo(this, 'savedProducts', Product);
        addPropertyTo(this, 'companyInvitations', CompanyInvitation);
        addPropertyTo(this, 'shipmentMethods', ShipmentMethod);

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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.patch = function (success, error, embed) {
            var self = this,
                data = serialise(this, undefined, undefined, undefined,
                                 {exlcudeOld: true})[0];
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            patchOne({resource: this.resource,
                      id: self.id(),
                      success: handleResponse,
                      error: error,
                      data: data,
                      embed: embed});
        };

        this.invite = function (companyMemberData, success, error, embed) {
            var request = new Request(),
                data = new Dictionary(),
                self = this;
                id = self.id();

            function handleResponse(status, result) {
                var newInvitation = new CompanyInvitation(),
                    invitation = JSON.parse(result),
                    invitations = self.companyInvitations() ?
                      self.companyInvitations() : [];
                newInvitation.id(invitation.id);
                newInvitation.userEmail(invitation.userEmail);
                newInvitation.userName(invitation.userName);
                newInvitation.inviteAsAdmin(invitation.inviteAsAdmin);
                invitations.push(newInvitation);
                self.companyInvitations(invitations);
                success(self);
            }

            data = new Dictionary();
            data.add("inviteUserEmail", companyMemberData.emailAddress);
            data.add("inviteUserName", companyMemberData.name);
            data.add("company-id", id);
            data.add("asAdmin", companyMemberData.isAdmin);
            request.resource('/company_invite/').method('POST');
            request.data().merge(data);
            request.responseHandler(handleResponse);
            request.errorHandler(error);
            request.send();
        }

        this.primaryEmailAddressEntity = function () {
            var emails = this.emailAddresses();
            return emails && emails[0] ? emails[0] : null;
        }

        this.primaryEmailAddress = function () {
            var email = this.primaryEmailAddressEntity();
            return email ? email.emailAddress() : null;
        };

        this.primaryPhoneNumberEntity = function () {
            var numbers = this.phoneNumbers();
            return numbers && numbers[0] ? numbers[0] : null;
        }

        this.primaryPhoneNumber = function () {
            var primary = this.primaryPhoneNumberEntity();
            return primary ? primary.internationalFormatNumber() : null;
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

        this.taxOptions = function () {
            var defaultOptions = this.defaultTaxType(),
                options = [];
            options.push(NoTaxEntity());
            if (defaultOptions) {
                options.push(defaultOptions);
            }
            return options;
        }

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };

        this.paymentMethodIsValid = function (methodAttribute) {
            var method = this[methodAttribute]();
            return Array.isArray(method) && method.length > 0 && method[0].id();
        }

        this.arePhonePaymentsValid = function () {
            return this.paymentMethodIsValid('paymentPhoneNumbers');
        }

        this.areBankPaymentsValid = function () {
            return this.paymentMethodIsValid('banks');
        }

        this.logoUrl = function () {
            var logo = this.logo();
            return logo && logo.viewUrl() ? logo.viewUrl() : null;
        }
    }

    function Category() {
        this.resource = '/categories';
        this.json = 'category';
        this.temporaryId = generateUUID();

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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error});
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };
    }

    function SubscriptionPlan() {
        this.resource = '/subscription_plans';
        this.json = 'subscriptionPlan';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'created');
        addPropertyTo(this, 'updated');
        addPropertyTo(this, 'createdBy', User);
        addPropertyTo(this, 'updatedBy', User);
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'tax', CountryTax);
        addPropertyTo(this, 'baseCost');
        addPropertyTo(this, 'whiteLabelDomainCost');
        addPropertyTo(this, 'perSmsCost');
        addPropertyTo(this, 'perUserCost');
        addPropertyTo(this, 'perDomainCost');
        addPropertyTo(this, 'baseUserCount');
        addPropertyTo(this, 'baseDomainCount');
        addPropertyTo(this, 'billingCycleDays');
        addPropertyTo(this, 'isPrivate');

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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error});
        };
    }

    function ComponentTag() {
        this.resource = '/component_tags';
        this.json = 'componentTag';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');

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
    }

    function Component() {
        this.resource = '/components';
        this.json = 'component';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'body');
        addPropertyTo(this, 'description');
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
    }

    function DomainTag() {
        this.resource = '/domain_tags';
        this.json = 'domainTag';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'description');
        addPropertyTo(this, 'colour');
        addPropertyTo(this, 'showPublic');
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'products', Product);

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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error});
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

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };
    }

    function VariationFieldsOption() {
        this.resource = '/variationFieldOptions';
        this.json = 'variationFieldOption';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'value');
        addPropertyTo(this, 'position');
        addPropertyTo(this, 'default');
        addPropertyTo(this, 'colour');
        addPropertyTo(this, 'variationCost');
        addPropertyTo(this, 'variationCostDiscountGroup', DiscountGroup);
        addPropertyTo(this, 'variationUnitCost');
        addPropertyTo(this, 'variationUnitCostDiscountGroup', DiscountGroup);
        addPropertyTo(this, 'linkedFile', MerchiFile);

        this.totalCost = function (quantity) {
            var total = this.variationCost() ?
                this.variationCost() : 0;
            if (this.variationUnitCost() && quantity) {
                total += (quantity * this.variationUnitCost());
            }
            return total;
        };

        this.onceOffCost = function () {
            return this.variationCost();
        };

        this.unitCost = function () {
            return this.variationUnitCost();
        };
    }

    function VariationField() {
        this.resource = '/variationFields';
        this.json = 'variationField';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'fieldType');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'position');
        addPropertyTo(this, 'placeholder');
        addPropertyTo(this, 'defaultValue');
        addPropertyTo(this, 'required');
        addPropertyTo(this, 'independent');
        addPropertyTo(this, 'variationCost');
        addPropertyTo(this, 'variationCostDiscountGroup', DiscountGroup);
        addPropertyTo(this, 'variationUnitCost');
        addPropertyTo(this, 'variationUnitCostDiscountGroup', DiscountGroup);
        addPropertyTo(this, 'options', VariationFieldsOption);
        addPropertyTo(this, 'defaultOptions', VariationFieldsOption);
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

        this.isTextType = function () {
            return this.isType('TEXT_INPUT');
        };

        this.isNumberType = function () {
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

        this.canMultiSelect = function () {
            return this.isImageSelectType() || this.isColourSelectType();
        }

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
            } else if (inputType === fieldTypes.get('COLOUR_PICKER')) {
                inputTypeString = 'color';
            }
            return inputTypeString;
        };

        this.hasMultipleDefaults = function () {
            return this.optionsDefaults().length > 1;
        };

        this.setSingleOptionDefault = function (index) {
            var i, options = this.options();
            for (i = 0; i < options.length; i++) {
                options[i].default(false);
            }
            options[index].default(true);
        }

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

        this.buildEmptyVariation = function () {
            var variationBuilt = new Variation(),
                value, options, i,
                onceOffCost = 0,
                variationCost,
                selectableOptions = [];
            if (this.isSelectable()) {
                options = this.options();
                value = [];
                for (i = 0; i < options.length; i++) {
                    const selectableOption = new VariationOption();
                    selectableOption.copyFieldOption(options[i]);
                    selectableOptions.push(selectableOption);
                    if (options[i].default()) {
                        value.push(options[i].id());
                        onceOffCost += options[i].variationCost();
                    }
                }
                variationBuilt.value(value.join());
                variationBuilt.onceOffCost(onceOffCost);
            } else {
                variationBuilt.value(this.defaultValue());
                variationBuilt.unitCost(this.variationUnitCost());
                variationBuilt.onceOffCost(this.variationCost());
            }
            variationBuilt.unitCostTotal('0');
            variationBuilt.cost(variationBuilt.onceOffCost());
            variationBuilt.variationField(clone(this));
            variationBuilt.selectableOptions(selectableOptions);
            return variationBuilt;
        };

        this.optionsHaveCost = function () {
            var i, options, o;
            function hasCost(cost) {
                return !isUndefinedOrNull(cost);
            }
            if (this.isSelectable()) {
                options = this.options();
                for (i = 0; i < options.length; i++) {
                    o = options[i];
                    if (hasCost(o.variationCost()) ||
                        hasCost(o.variationUnitCost())) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    function VariationOption() {
        this.json = 'variation_option';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'optionId');
        addPropertyTo(this, 'value');
        addPropertyTo(this, 'position');
        addPropertyTo(this, 'default');
        addPropertyTo(this, 'colour');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'onceOffCost');
        addPropertyTo(this, 'unitCost');
        addPropertyTo(this, 'unitCostTotal');
        addPropertyTo(this, 'totalCost');
        addPropertyTo(this, 'fieldName');
        addPropertyTo(this, 'linkedFile', MerchiFile);

        this.copyFieldOption = function (option) {
            this.optionId(option.id());
            this.value(option.value());
            this.colour(option.colour());
            this.position(option.position());
            this.default(option.default());
            this.onceOffCost(option.variationCost());
            this.unitCost(option.variationUnitCost());
            this.linkedFile(option.linkedFile());
        }

        // a hack around function for job cloneable renderering
        this.covertToVariation = function () {
            var variationConverted = new Variation(),
                unitCost = this.unitCost(),
                fieldName = this.fieldName(),
                optionValue = this.value(),
                totalCost = this.totalCost();
            variationConverted.value(this.optionId());
            variationConverted.quantity(this.quantity());
            variationConverted.onceOffCost(this.onceOffCost());
            variationConverted.unitCostTotal(this.unitCostTotal());
            // hack around for variation unit cost
            variationConverted.unitCost = function () {
                return unitCost;
            };
            variationConverted.valueString = function () {
                return optionValue;
            };
            variationConverted.fieldName = function () {
                return fieldName;
            };
            return variationConverted;
        };
    }

    function Variation() {
        this.resource = '/variation';
        this.json = 'variation';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'value');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'cost');
        addPropertyTo(this, 'onceOffCost');
        addPropertyTo(this, 'unitCost');
        addPropertyTo(this, 'unitCostTotal');
        addPropertyTo(this, 'selectableOptions', VariationOption);
        addPropertyTo(this, 'selectedOptions', VariationOption);
        addPropertyTo(this, 'variationField', VariationField);
        addPropertyTo(this, 'variationFiles', MerchiFile);

        this.unitCostAndOnceOffCost = function () {
            var unitCost = this.unitCost() ? this.unitCost() : 0,
                onceOffCost = this.onceOffCost() ? this.onceOffCost() : 0;
            return unitCost + onceOffCost;
        }

        this.unitCostTotalAndOnceOffCost = function () {
            var unitCostTotal = this.unitCostTotal() ? this.unitCostTotal() : 0,
                onceOffCost = this.onceOffCost() ? this.onceOffCost() : 0;
            return unitCostTotal + onceOffCost;
        }

        this.isTextField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isTextType();
        };

        this.isNumberField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isNumberType();
        };

        this.isSelectField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isSelectType();
        };

        this.isCheckBoxField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isCheckboxType();
        };

        this.isRadioField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isRadioType();
        };

        this.isColourSelectField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isColourSelectType();
        };

        this.isImageSelectField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isImageSelectType();
        };

        this.isCheckboxOrRadioField = function () {
            return this.isRadioField() || this.isCheckBoxField();
        };

        this.isSelectableField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isSelectable();
        };

        this.canHaveMultipleSelected = function () {
            var field = this.variationField();
            return Boolean(field) && field.isDefaultMultiSelect();
        };

        this.isTextAreaField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isTextAreaType();
        };

        this.isInstructionsField = function () {
            var field = this.variationField();
            return Boolean(field) && field.isInstructionsType();
        };

        this.isFileUpload = function () {
            var field = this.variationField();
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
            var field = this.variationField(),
                text = "", option, i;
            if (field) {
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

        this.optionIsSelected = function(id) {
            const selectedIds = this.valueArray(); 
            return -1 < selectedIds.findIndex(
                (_id) => String(_id) === String(id));
        };

        this.selectedSelectableOptions = function () {
            var self = this,
                options = this.selectableOptions() ?
                  this.selectableOptions() : [];
            return options.filter((o) =>
                self.optionIsSelected(o.optionId()));
        };

        this.selectedFieldOptions = function () {
            var field = this.variationField(),
                options = field.options() ? field.options() : [],
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
            return this.variationField().name();
        };

        this.fieldType = function () {
            return this.variationField().fieldType();
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
            var cloneVariation = new Variation();
            cloneVariation.value(this.value());
            cloneVariation.cost(this.cost());
            cloneVariation.variationField(this.variationField());
            cloneVariation.variationFiles(this.variationFiles());
            return cloneVariation;
        };

        this.valueIdArray = function () {
            var value = this.value();
            return value ? value.split(',') : [];
        }

        this.concatinatedSelectedOptionValues = function () {
            var optionIds = this.valueIdArray(),
                optionIdsLength = optionIds.length - 1,
                field = this.variationField(),
                value = '',
                option,
                i;
            for (i = 0; i < optionIds.length; i++) {
                option = field.findOptionById(optionIds[i]);
                value += option.value();
                if (optionIdsLength > i) {
                    value += ', ';
                }
            }
            return value;
        }

        this.valueString = function () {
            var field = this.variationField();
            if (field.isSelectable()) {
                return this.concatinatedSelectedOptionValues();
            } else if (this.isFileUpload() && this.variationFiles()) {
                if (this.variationFiles().length > 1) {
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

    function VariationsGroup() {
        this.resource = '/variationsGroups';
        this.json = 'variationsGroup';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'groupCost');
        addPropertyTo(this, 'variations', Variation);

        this.clone = function () {
            var groupClone = new VariationsGroup(),
                variationsClone = [], i;
            groupClone.groupCost(this.groupCost());
            groupClone.quantity(this.quantity());
            for (i = 0; i < this.variations().length; i++) {
                variationsClone.push(this.variations()[i].clone());
            }
            return groupClone.variations(variationsClone);
        };

        this.loopVariationsAndReturnAttributeTotal = function (attribute) {
            var variations = this.variations() ?
                    this.variations() : [],
                total = 0,
                i;
            for (i = 0; i < variations.length; i++) {
                total += variations[i][attribute]();
            }
            return parseFloat(total).toFixed(2);
        };

        this.variationsUnitCostAndOnceOffCost = function () {
            return this.loopVariationsAndReturnAttributeTotal(
                'unitCostAndOnceOffCost');
        };
    }

    function Discount() {
        this.resource = '/discounts';
        this.json = 'discount';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'lowerLimit');
        addPropertyTo(this, 'amount');

        this.discountedUnitCost = function (unitPrice) {
            var unitCost = unitPrice ? unitPrice : 0,
                amount = this.amount() ? this.amount() : 0,
                discount = 100 - amount;
            return parseFloat((unitCost / 100) * discount).toFixed(3);
        };
    }

    function DiscountGroup() {
        this.resource = '/discountGroups';
        this.json = 'discountGroup';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'discountType');
        addPropertyTo(this, 'discounts');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'product');
    }


    function Product() {
        this.resource = '/products';
        this.json = 'product';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'independent');
        addPropertyTo(this, 'productType');
        addPropertyTo(this, 'description');
        addPropertyTo(this, 'notes');
        addPropertyTo(this, 'minimum');
        addPropertyTo(this, 'deliveryDaysNormal');
        addPropertyTo(this, 'unitPrice');
        addPropertyTo(this, 'unitPriceDiscountGroup', DiscountGroup);
        addPropertyTo(this, 'bestPrice');
        addPropertyTo(this, 'unitWeight');
        addPropertyTo(this, 'unitHeight');
        addPropertyTo(this, 'unitWidth');
        addPropertyTo(this, 'unitDepth');
        addPropertyTo(this, 'unitVolume');
        addPropertyTo(this, "needsDrafting");
        addPropertyTo(this, "needsProduction");
        addPropertyTo(this, "needsShipping");
        addPropertyTo(this, "needsInvoicing");
        addPropertyTo(this, "suppliers", User);
        addPropertyTo(this, "groupVariationFields", VariationField);
        addPropertyTo(this, "independentVariationFields", VariationField);
        addPropertyTo(this, "originalProduct", Product);
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'suppliedByDomains', SupplyDomain);
        addPropertyTo(this, 'supplyDomains', SupplyDomain);
        addPropertyTo(this, 'images', MerchiFile);
        addPropertyTo(this, 'featureImage', MerchiFile);
        addPropertyTo(this, 'publicFiles', MerchiFile);
        addPropertyTo(this, 'productionFiles', MerchiFile);
        addPropertyTo(this, 'showPublic');
        addPropertyTo(this, 'acceptStripe');
        addPropertyTo(this, 'acceptPaypal');
        addPropertyTo(this, 'acceptUtrust');
        addPropertyTo(this, 'acceptBankTransfer');
        addPropertyTo(this, 'acceptPhonePayment');
        addPropertyTo(this, 'allowPaymentUpfront');
        addPropertyTo(this, 'allowQuotation');
        addPropertyTo(this, 'savedByUsers', User);
        addPropertyTo(this, 'savedByCompanies', Company);
        addPropertyTo(this, 'tags', DomainTag);
        addPropertyTo(this, 'inventories', Inventory);
        addPropertyTo(this, 'discountGroups', DiscountGroup);
        addPropertyTo(this, 'categories', Category);
        addPropertyTo(this, 'taxType', CountryTax);

        this.create = function (success, error, embed, asDomain) {
            var data = serialise(this),
                self = this,
                domain = self.domain() ? self.domain().id() : null,
                domainId = isUndefinedOrNull(asDomain) ? domain : asDomain;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: domainId,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

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

        this.patch = function (success, error, embed) {
            var self = this,
                data = serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0];
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

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };

        this.duplicate = function (success, error) {
            var self = this,
                request = new Request(),
                jsonBody;
            request.resource('/products/' + self.id() + '/copy/');
            request.method('POST');
            function handleResponse(status, body) {
                var result = '';
                if (status === 201) {
                    try {
                        jsonBody = JSON.parse(body);
                        result = fromJson(self, jsonBody[self.json]);
                        success(result);
                    } catch (e) {
                        result = {message: 'invalid json from server'};
                        error(null, result);
                    }
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Unable to duplicate product.'};
                    }
                    error(null, result);
                }
            }
            request.responseHandler(handleResponse).errorHandler(error);
            request.send();
        };

        this.company = function () {
            return this.domain() ? this.domain().company() : null;
        }

        this.variationFields = function () {
            var variationFields = [];
            if (notEmptyArray(this.groupVariationFields())) {
                variationFields = variationFields.
                    concat(this.groupVariationFields());
            }

            if (notEmptyArray(this.independentVariationFields())) {
                variationFields = variationFields.
                    concat(this.independentVariationFields());
            }
            return variationFields;
        };

        this.removeVariation = function (variation) {
            var variations = !variation.independent() ?
                this.groupVariationFields() : this.independentVariationFields();
            return removeObjectFromArrayWithIntegerValue(
                variations, 'id', variation.id());
        };

        this.primaryImage = function () {
            var feature = this.featureImage(),
                images = this.images(), 
                firstImage = images && images[0] ? images[0] : null;
            return feature ? feature : firstImage;
        };

        this.productPrimaryImage = function () {
            return this.primaryImage() ? this.primaryImage().viewUrl() : null;
        };

        this.productCurrency = function () {
            var domain = this.domain();
            return domain && domain.company() ?
                domain.company().defaultCurrency() : null;
        };

        this.hasGroupVariationFields = function () {
            return notEmptyArray(this.groupVariationFields());
        };

        this.hasIndependentVariationFields = function () {
            return notEmptyArray(this.independentVariationFields());
        };

        this.buildEmptyVariationGroup = function () {
            var variationsGroupBuilt = new VariationsGroup(),
                groupVariationFields = this.groupVariationFields(),
                emptyGroupCost = 0,
                variations = [],
                i,
                emptyVariation;
            variationsGroupBuilt.quantity('0');

            for (i = 0; i < groupVariationFields.length; i++) {
                emptyVariation =
                    groupVariationFields[i].buildEmptyVariation();
                variations.push(emptyVariation);
                emptyGroupCost += parseFloat(emptyVariation.cost(), 10);
            }

            variationsGroupBuilt.groupCost(emptyGroupCost.toString());
            variationsGroupBuilt.variations(variations);
            return variationsGroupBuilt;
        };

        this.buildEmptyVariations = function () {
            var emptyVariations = [],
                emptyVariation,
                independentVariationFields = this.independentVariationFields(),
                i;

            for (i = 0; i < independentVariationFields.length; i++) {
                emptyVariation =
                    independentVariationFields[i].buildEmptyVariation();
                emptyVariations.push(emptyVariation);
            }
            return emptyVariations;
        };

        this.tax = function () {
            return this.taxType();
        };

        this.previewImages = function (maxImages) {
            var files = this.images();
            if (Boolean(files)) {
                return files.slice(0, maxImages);
            }
            return [];
        };

        this.stripePublishableKey = function () {
            return this.domain().company() ?
                this.domain().company().stripePublishableKey() : null;
        };

        this.stripeIsValidAndActive = function () {
            const company = this.domain().company();
            return this.stripePublishableKey() && company &&
                company.acceptStripe();
        };

        this.isMOD = function () {
            return this.productType() ===
                productTypesInts.get('MOD (made on demand)');
        };

        this.isResell = function () {
            return this.isMOD();
        };
    }

    function QuoteItem() {
        this.resource = '/quote_items';
        this.json = 'quoteItem';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'type');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'description');
        addPropertyTo(this, 'unitPrice');

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

        this.total = function () {
            var self = this,
                quantity = Boolean(self.quantity()) ? self.quantity() : 0,
                unitPrice = Boolean(self.unitPrice()) ? self.unitPrice() : 0,
                total;
            total = quantity * unitPrice;
            return total.toFixed(3);
        };
    }

    function SupplyDomain() {
        this.resource = '/supply_domains';
        this.json = 'supplyDomain';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'product', Product);
        addPropertyTo(this, 'supplyProduct', Product);
        addPropertyTo(this, 'domain', Domain);

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
  }

    function Quote() {
        this.resource = '/quotes';
        this.json = 'quote';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'agreedDeadline');
        addPropertyTo(this, 'quoteItems', QuoteItem);
        addPropertyTo(this, 'assignments', Assignment);
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'invoice', Invoice);

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

        this.quoteTotal = function () {
            var self = this,
                items = Boolean(self.quoteItems()) ? self.quoteItems() : [],
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
                quoteItems = Boolean(self.quoteItems()) ? self.quoteItems() : [];
            return quoteItems.findIndex(function (arrayElement) {
                    return String(arrayElement.id()) === String(quoteItemId);
                });
        };

        this.removeQuoteItem = function (quoteItem) {
            var self = this,
                itemIndex = self.findQuoteItemIndex(quoteItem.id()),
                quoteItems = self.quoteItems();
            if (Boolean(quoteItems) && itemIndex >= 0) {
                quoteItems.splice(itemIndex, 1);
            }
        };
    }

    function ShipmentMethodVariation() {
        this.resource = '/shipment_method_variations';
        this.json = 'shipmentMethodVariation';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'destinationCountry');
        addPropertyTo(this, 'destinationState');
        addPropertyTo(this, 'cost');
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'maxWeight');
        addPropertyTo(this, 'shipmentMethod', ShipmentMethod);
        addPropertyTo(this, 'taxType', CountryTax);
    }

    function ShipmentMethod() {
        this.resource = '/shipment_methods';
        this.json = 'shipmentMethod';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'originAddress', Address);
        addPropertyTo(this, 'company', Company);
        addPropertyTo(this, 'companyDefault');
        addPropertyTo(this, 'defaultCost');
        addPropertyTo(this, 'maxCost');
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'transportCompany');
        addPropertyTo(this, 'variations', ShipmentMethodVariation);
        addPropertyTo(this, 'taxType', CountryTax);

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
                data = serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0];
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
    }

    function CartShipmentQuote() {
        this.resource = '/cart_shipment_quotes';
        this.json = 'cartShipmentQuote';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'subtotalCost');
        addPropertyTo(this, 'taxAmount');
        addPropertyTo(this, 'totalCost');
        addPropertyTo(this, 'shipmentMethod', ShipmentMethod);

        this.name = function () {
            const shipmentMethod = this.shipmentMethod();
            return shipmentMethod ? shipmentMethod.name() : null;
        }
    }

    function CartShipmentGroup() {
        this.resource = '/cart_shipment_groups';
        this.json = 'cartShipmentGroup';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'cartItems', CartItem);
        addPropertyTo(this, 'quotes', CartShipmentQuote);
        addPropertyTo(this, 'selectedQuote', CartShipmentQuote);

        this.selectedQuoteName = function () {
            var selectedQuote = this.selectedQuote();
            return selectedQuote ? selectedQuote.name() : null;
        }
    }

    function Shipment() {
        this.resource = '/shipments';
        this.json = 'shipment';
        this.temporaryId = generateUUID();

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
        addPropertyTo(this, 'invoices', Invoice);
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
        addPropertyTo(this, 'tags', DomainTag);
        addPropertyTo(this, 'shipmentMethod', ShipmentMethod);

        this.get = function (success, error, embed) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: False}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.create = function (options) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                options.success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: options.error,
                    embed: options.embed});
        };

        this.patch = function (success, error, data, embed) {
            var self = this;
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

        this.update = function (options) {
            var self = this;
            this.patch(options.success,
                options.error,
                serialise(self, undefined, undefined, undefined,
                          {excludeOld: true})[0],
                options.embed);
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
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

        this.userIsResponsible = function (user) {
            var senderResponsible = this.senderResponsible(),
                shipmentUser = senderResponsible ?
                    this.sender() : this.receiver();
            return shipmentUser && shipmentUser.id() === user.id();
        };

        this.responsibleCompany = function () {
            return this.senderResponsible() ?
                this.senderCompany() : this.receiverCompany();
        };
    }

    function Assignment() {
        this.resource = '/assignments';
        this.json = 'assignment';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'managerAccepts');
        addPropertyTo(this, 'supplierRefused');
        addPropertyTo(this, 'productionDeadline');
        addPropertyTo(this, 'assignmentDeadline');
        addPropertyTo(this, 'archived');
        addPropertyTo(this, 'job', Job);
        addPropertyTo(this, 'supplyJob', Job);
        addPropertyTo(this, 'supplier', User);
        addPropertyTo(this, 'quote', Quote);
        addPropertyTo(this, 'shipment', Shipment);
        addPropertyTo(this, 'supplyDomain', SupplyDomain);
        addPropertyTo(this, 'comments', ProductionComment);
        addPropertyTo(this, 'notifications', Notification);

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

        this.agreedDeadline = function () {
            var self = this,
                quote = self.quote();
            if (Boolean(quote)) {
                return quote.agreedDeadline();
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
                data = serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0],
                domainId = Boolean(asDomain) ? asDomain.id() : null;
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
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
                quote = self.quote();
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
        this.temporaryId = generateUUID();

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
        addPropertyTo(this, 'openToClient');

        this.create = function (options) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                options.success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    as_domain: options.as_domain,
                    error: options.error,
                    embed: options.embed});
        };
    }

    function DraftComment() {
        this.resource = '/draft_comments';
        this.json = 'draftComment';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'draft', Draft);
        addPropertyTo(this, 'user', User);
        addPropertyTo(this, 'file', MerchiFile);
        addPropertyTo(this, 'notifications', Notification);
        addPropertyTo(this, 'job', Job);
        addPropertyTo(this, 'date');
        addPropertyTo(this, 'text');
        addPropertyTo(this, 'urgency');
        addPropertyTo(this, 'subject');
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');
        addPropertyTo(this, 'changeRequest');

        this.create = function (options) {
            var data = serialise(this),
                self = this;
            function handleResponse(result) {
                options.success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    as_domain: options.as_domain,
                    error: options.error,
                    embed: options.embed});
        };
    }

    function Draft() {
        this.resource = '/drafts';
        this.json = 'draft';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'job', Job);
        addPropertyTo(this, 'designer', User);
        addPropertyTo(this, 'file', MerchiFile);
        addPropertyTo(this, 'date');
        addPropertyTo(this, 'accepted');
        addPropertyTo(this, 'resendDate');
        addPropertyTo(this, 'viewed');
        addPropertyTo(this, 'justViewed');
        addPropertyTo(this, 'comments', DraftComment);
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');

        this.get = function (success, error, embed, include_archived) {
            var self = this;
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error,
                    embed: embed,
                    includeArchived: include_archived});
        };

        this.patch = function (options) {
            var self = this,
                data = serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0],
                job = this.job(),
                domain = job && job.domain() ? job.domain().id() : null,
                asDomain = options.asDomain,
                domainId = isUndefined(asDomain) ? domain : asDomain;
            function handleResponse(result) {
                options.success(fromJson(self, result[self.json]));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      error: options.error,
                      as_domain: domainId,
                      data: data,
                      embed: options.embed});
        };

        this.changesRequested = function () {
            var comments = this.comments() ? this.comments() : [],
                i;
            for (i = 0; i < comments.length; i++) {
                if (comments[i].changeRequest()) {
                    return true;
                }
            }
            return false;
        }

        this.commentsYoungestToEldest = function () {
            return sortArrayByObjectKeyDescending(this.comments(), 'id');
        }
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

        this.create = function (options) {
            var data = serialise(this),
                self = this,
                embed = options.embed ? options.embed : {};
            function handleResponse(result) {
                options.success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    as_domain: options.asDomain,
                    error: options.error,
                    embed: embed});
        };
    }

    function Page() {
        this.resource = '/pages';
        this.json = 'page';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'slug');
        addPropertyTo(this, 'template');
        addPropertyTo(this, 'theme', Theme);

        this.text = function (text) {
            if (!isUndefinedOrNull(text)) {
                this.template(text);
            } else {
                return this.template();
            }
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
    }

    function Payment() {
        this.resource = '/payments';
        this.json = 'payments';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'note');
        addPropertyTo(this, 'paymentType');
        addPropertyTo(this, 'payDate');
        addPropertyTo(this, 'amount');
        addPropertyTo(this, 'sendSms');
        addPropertyTo(this, 'sendEmail');
        addPropertyTo(this, 'paymentRecorder', User);

        this.paymentTypeText = function () {
            var paymentType = this.paymentType();
            return paymentType ? paymentTypes.get(paymentType) : 'Unknown';
        }
    }

    function CountryTaxes() {
        this.resource = '/country_taxes';
        this.json = 'countryTaxes';
        this.single = CountryTax;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result,
                                     {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    parameters);
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

    function NoTaxEntity() {
        var tax = new CountryTax();
        return fromJson(
            tax,
            {id: null, taxName: 'No tax', taxPercent: 0},
            {makesDirty: false}
        );
    }

    function Item() {
        this.resource = '/items';
        this.json = 'items';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'taxType', CountryTax);
        addPropertyTo(this, 'taxAmount');
        addPropertyTo(this, 'cost');
        addPropertyTo(this, 'description');

        this.totalCost = function () {
            var quantity = this.quantity() ? this.quantity() : 0,
                cost = this.cost() ? this.cost() : 0;
          return quantity * cost;
        }
    }

    function Inventory() {
        this.resource = '/inventories';
        this.json = 'inventory';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'name');
        addPropertyTo(this, 'notes');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'product', Product);
        addPropertyTo(this, 'address', Address);
        addPropertyTo(this, 'inventoryUnitVariations',
                      InventoryUnitVariation);

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
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            getOne({resource: this.resource,
                    id: this.id(),
                    success: handleResponse,
                    error: error});
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
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

        this.update = function (success, error, embed) {
            this.patch(success, error,
                       serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0], embed);
        };

        this.isVariationFieldOptionSelected = function (option) {
            var selectedVariations = this.inventoryUnitVariations() ?
                this.inventoryUnitVariations() : [];
            for (var i = 0; i < selectedVariations.length; i++) {
                if (selectedVariations[i].optionId() === option.id()) {
                    return true;
                }
            }
            return false;
        };

    }

    function InventoryUnitVariation() {
        this.resource = '/inventory_unit_variations';
        this.json = 'inventoryUnitVariation';

        addPropertyTo(this, 'variationFieldsOption',
                      VariationFieldsOption);

        this.optionId = function () {
            return this.variationFieldsOption().id();
        };
    }

    function Invoice() {
        this.resource = '/invoices';
        this.json = 'invoice';
        this.temporaryId = generateUUID();

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
        addPropertyTo(this, 'quotes', Quote);
        addPropertyTo(this, 'items', Item);
        addPropertyTo(this, 'shipping', Address);
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'pdf', MerchiFile);
        addPropertyTo(this, 'receipt', MerchiFile);
        addPropertyTo(this, 'payments', Payment);
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'acceptStripe');
        addPropertyTo(this, 'acceptPaypal');
        addPropertyTo(this, 'acceptUtrust');
        addPropertyTo(this, 'acceptBankTransfer');
        addPropertyTo(this, 'acceptPhonePayment');
        addPropertyTo(this, 'tags', DomainTag);
        addPropertyTo(this, 'reminderMessage');
        addPropertyTo(this, 'reminded');
        addPropertyTo(this, 'isRemindable');
        addPropertyTo(this, 'forceReminders');
        addPropertyTo(this, 'owedMoney');
        addPropertyTo(this, 'paidMoney');
        addPropertyTo(this, 'isCompletelyPaid');
        addPropertyTo(this, 'shipments', Shipment);


        this.create = function (success, error, embed, asDomain) {
            var data = serialise(this),
                self = this,
                domain = self.domain() ? self.domain().id() : null,
                domainId = isUndefinedOrNull(asDomain) ? domain : asDomain;
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: domainId,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.patch = function (success, error, embed, asDomain) {
            var self = this,
                data = serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0],
                domain = self.domain() ? self.domain().id() : null,
                domainId = isUndefinedOrNull(asDomain) ? domain : asDomain;
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      error: error,
                      as_domain: domainId,
                      data: data,
                      embed: embed});
        };

        this.publicCreate = function (success, error) {
            var data = serialise(this),
                self = this,
                result = '',
                request = new Request();
            request.data().merge(data[0]);
            request.resource('/public-invoice-create/');
            request.method('POST');
            function handleResponse(status, body) {
                var jsonBody;
                if (status === 201) {
                    try {
                        jsonBody = JSON.parse(body);
                        result = fromJson(self, jsonBody[self.json]);
                        success(result);
                    } catch (e) {
                        result = {message: 'invalid json from server'};
                        error(status, result);
                    }
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Unable to create invoice.'};
                    }
                    error(status, result);
                }
            }
            function handleError(status, body) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Invalid json from server',
                              errorCode: 0};
                }
                error(status, result);
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };

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

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };

        this.company = function () {
            return this.domain() ? this.domain().company() : null;
        };

        this.paymentPhoneNumbers = function () {
            return this.company() ?
                this.company().paymentPhoneNumbers() : null;
        }

        this.paymentBanks = function () {
            return this.company() ? this.company().banks() : null;
        }

        this.stripePublishableKey = function () {
            return this.company() ?
              this.company().stripePublishableKey() : null;
        }

        this.calculate = function (success, error, embed) {
            var self = this,
                request = new Request(),
                data = serialise(this)[0];
            request.resource('/invoice-cost-estimate/');
            request.method('POST');
            request.query().add("as_domain", self.domain().id());
            request.query().add('skip_rights', true);
            request.data().merge(data);
            function handleResponse(status, body) {
                var result = '';
                if (status === 201) {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'invalid json from server',
                                  errorCode: 0};
                    }
                    success(fromJson(self, result));
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'could not get quote',
                                  errorCode: 0};
                    }
                    error(result);
                }
            }
            function handleError() {
                error({message: 'could not connect to server',
                       errorCode: 0});
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };

        this.amountPaid = function () {
            var payments = this.payments() ? this.payments() : [],
                total = 0,
                i;
            for (i = 0; i < payments.length; i++) {
                var amount = payments[i].amount();
                total += amount ? amount : 0;
            }
            return total;
        }

        this.amountOwed = function () {
            var total = this.totalCost();
            return total - this.amountPaid();
        }

        this.isOverdue = function () {
            var unpaid = this.unpaid(),
                now = moment().unix();
            return unpaid && (now > this.paymentDeadline());
        }
    }

    function Notification() {
        this.resource = '/notifications';
        this.json = 'notification';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'recipient', User);
        addPropertyTo(this, 'sender', User);
        addPropertyTo(this, 'date');
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'relatedJob', Job);
        addPropertyTo(this, 'attachment', MerchiFile);
        addPropertyTo(this, 'seen');
        addPropertyTo(this, 'htmlMessage');
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

        this.patch = function (success, error, embed, asDomain) {
            var self = this,
                data = serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0],
                domainId = Boolean(asDomain) ? asDomain.id() : null;
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            patchOne({resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      error: error,
                      as_domain: domainId,
                      data: data,
                      embed: embed});
        };

        this.avatarUrl = function () {
            var noteType = this.notificationType(),
                sender = this.sender(),
                senderAvatarUri = sender && sender.profilePicture() ?
                  sender.profilePictureUrl() : null,
                domain = this.domain(),
                domainAvatarUri = domain && domain.logo() ?
                  domain.logo().viewUrl() : null;
            if (isAvatarTypeInNotificationAvatar('SHOW_USER_AVATAR', noteType)) {
                return senderAvatarUri;
            } else if (isAvatarTypeInNotificationAvatar('SHOW_DOMAIN_AVATAR',
                                                        noteType)) {
                return domainAvatarUri;
            } else if (isAvatarTypeInNotificationAvatar(
                           'SHOW_USER_OR_DOMAIN_AVATAR', noteType)) {
                return sender ? senderAvatarUri : domainAvatarUri;
            } else if (isAvatarTypeInNotificationAvatar(
                           'SHOW_DOMAIN_OR_USER_AVATAR', noteType)) {
                return domain ? domainAvatarUri : senderAvatarUri;
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

        this.notificationTypeKey = function () {
            var noteType = this.notificationType();
            return noteType ? notificationTypesKeys.get(noteType) : null;
        };
    }

    function MatchingInventory() {
        this.resource = '/matching_inventories';
        this.json = 'matching_inventory';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'deductionDate');
        addPropertyTo(this, 'canDeduct');
        addPropertyTo(this, 'inventory', Inventory);
        addPropertyTo(this, 'job', Job);
        addPropertyTo(this, 'group', VariationsGroup);
    }

    function Job() {
        this.resource = '/jobs';
        this.json = 'job';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'notes');
        addPropertyTo(this, 'product', Product);
        addPropertyTo(this, 'priority');
        addPropertyTo(this, 'received');
        addPropertyTo(this, 'deadline');
        addPropertyTo(this, 'updated');
        addPropertyTo(this, 'deductionDate');
        addPropertyTo(this, 'clientFiles', MerchiFile);
        addPropertyTo(this, 'productionFiles', MerchiFile);
        addPropertyTo(this, 'drafts', Draft);
        addPropertyTo(this, 'draftComments', DraftComment);
        addPropertyTo(this, 'comments', JobComment);
        addPropertyTo(this, 'invoice', Invoice);
        addPropertyTo(this, 'shipment', Shipment);
        addPropertyTo(this, 'client', User);
        addPropertyTo(this, 'clientEmail', EmailAddress);
        addPropertyTo(this, 'clientPhone', PhoneNumber);
        addPropertyTo(this, 'clientCompany', Company);
        addPropertyTo(this, 'clientCompanyEmail', EmailAddress);
        addPropertyTo(this, 'clientCompanyPhone', PhoneNumber);
        addPropertyTo(this, 'manager', User);
        addPropertyTo(this, 'designer', User);
        addPropertyTo(this, 'shipping', Address);
        addPropertyTo(this, 'productionShippingAddress', Address);
        addPropertyTo(this, 'supplyAssignment', Assignment);
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'cost');
        addPropertyTo(this, 'taxAmount');
        addPropertyTo(this, 'totalCost');
        addPropertyTo(this, 'taxType', CountryTax);
        addPropertyTo(this, 'costPerUnit');
        addPropertyTo(this, 'automaticPriceEnabled');
        addPropertyTo(this, 'tags', DomainTag);

        // not embedded by default
        addPropertyTo(this, 'unreadNotificationsCount');
        addPropertyTo(this, 'unreadJobInfoNotificationsCount')
        addPropertyTo(this, 'unreadJobDraftingNotificationsCount');
        addPropertyTo(this, 'unreadJobProductionNotificationsCount');
        addPropertyTo(this, 'unreadJobShippingNotificationsCount');
        addPropertyTo(this, 'unreadJobInvoicingNotificationsCount');
        addPropertyTo(this, 'matchingInventories', MatchingInventory);
        addPropertyTo(this, 'canDeduct');

        addPropertyTo(this, 'productionNotes');
        addPropertyTo(this, "needsDrafting");
        addPropertyTo(this, "needsProduction");
        addPropertyTo(this, "needsShipping");
        addPropertyTo(this, "needsInvoicing");
        addPropertyTo(this, 'shippingStatus');
        addPropertyTo(this, 'designStatus');
        addPropertyTo(this, 'paymentStatus');
        addPropertyTo(this, 'productionStatus');
        addPropertyTo(this, 'assignments', Assignment);
        addPropertyTo(this, 'archived');
        addPropertyTo(this, 'notifications', Notification);
        addPropertyTo(this, 'variationsGroups', VariationsGroup);
        addPropertyTo(this, 'variations', Variation);
        addPropertyTo(this, 'jobVolume');
        addPropertyTo(this, 'jobWeight');
        addPropertyTo(this, 'completed');
        addPropertyTo(this, 'jobInfoApprovedByClient');
        addPropertyTo(this, 'quoteSet');

        this.create = function (
            success, error, embed, asDomain, withRights) {
            var data = serialise(this),
                self = this,
                settings = {
                    as_domain: asDomain,
                    embed: embed,
                    error: error,
                    files: enumerateFiles(data[1]),
                    parameters: data[0],
                    resource: this.resource,
                    withRights: withRights};
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            settings.success = handleResponse;
            create(settings);
        };

        this.publicCreate = function (success, error) {
            var data = serialise(this),
                self = this,
                result = '',
                request = new Request();
            request.data().merge(data[0]);
            request.resource('/public-job-create/');
            request.method('POST');
            request.query().add('skip_rights', true);
            function handleResponse(status, body) {
                var jsonBody;
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
                        result = {message: 'Unable to create job.'};
                    }
                    error(result);
                }
            }
            function handleError(status, body) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Invalid json from server',
                              errorCode: 0};
                }
                error(status, result);
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };

        this.get = function (success, error, embed, includeArchived,
                             withRights) {
            var self = this,
                parameters = {
                    embed: embed,
                    error: error,
                    id: this.id(),
                    includeArchived: includeArchived,
                    withRights: withRights,
                    resource: this.resource};
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            parameters.success = handleResponse;
            getOne(parameters);
        };

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };

        this.recover = function (success, error) {
            recoverOne("jobs", this.id(), success, error);
        };

        this.patch = function (
            success, error, embed, asDomain, withRights) {
            var self = this,
                data = serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0],
                domain = Boolean(self.domain()) ? self.domain().id() : null,
                domainId = isUndefinedOrNull(asDomain) ? domain : asDomain,
                settings = {
                    as_domain: domainId,
                    data: data,
                    embed: embed,
                    error: error,
                    id: this.id(),
                    withRights: withRights,
                    resource: this.resource};
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            settings.success = handleResponse;
            patchOne(settings);
        };

        this.hasVariations = function () {
            var variations = this.variations();
            return Boolean(variations) && variations.length > 0;
        };

        this.hasVariationsGroups = function () {
            var groups = this.variationsGroups();
            return Boolean(groups) && groups.length > 0;
        };

        this.variationGroupsTotalQuantity = function () {
            var self = this,
                groups = Boolean(self.variationsGroups()) ?
                    self.variationsGroups() : [],
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
            var costPerUnit = this.costPerUnit() ? this.costPerUnit() : 0,
                qty = this.quantity() ? this.quantity() : 0;
            return costPerUnit * qty;
        };

        this.loopVariationsAndReturnAttributeTotal = function (attribute) {
            var variations = this.variations() ?
                    this.variations() : [],
                total = 0,
                i;
            for (i = 0; i < variations.length; i++) {
                total += variations[i][attribute]();
            }
            return parseFloat(total).toFixed(2);
        };

        this.variationsUnitCostAndOnceOffCost = function () {
            return this.loopVariationsAndReturnAttributeTotal(
                'unitCostAndOnceOffCost');
        };

        this.variationsTotalCost = function () {
            return this.loopVariationsAndReturnAttributeTotal(
                'unitCostTotalAndOnceOffCost');
        }

        this.assignmentsUnarchived = function () {
            var assignments = this.assignments() ? this.assignments() : [],
                unarchived = [],
                i;
            for (i = 0; i < assignments.length; i++) {
                if (!assignments[i].archived()) {
                    unarchived.push(assignments[i]);
                }
            }
            return unarchived;
        };

        this.productionAcceptedAssignment = function () {
            var assignments = this.assignmentsUnarchived(),
                i;
            for (i = 0; i < assignments.length; i++) {
                if (assignments[i].managerAccepts()) {
                    return assignments[i];
                }
            }
            return null;
        };

        this.productionQuotingComplete = function () {
            return this.productionStatus() >=
                jobStatusProduction.get('ASSIGN_DEADLINE_REACHED');
        };

        this.sectionReached = function (jobAttribute, sectionState) {
            var job = this,
                section = job[jobAttribute]();
            return section && section >= sectionState;
        }

        this.productionComplete = function () {
            var isShipped =
                this.sectionReached('productionStatus',
                    jobStatusProduction.get('SHIPPED'));
            var isCompleted =
                this.sectionReached('productionStatus',
                    jobStatusProduction.get('COMPLETED'));
            return isShipped || isCompleted || !this.needsProduction();
        }

        this.draftingComplete = function () {
            return this.sectionReached('designStatus',
                jobStatusDrafting.get('DRAFTING_APPROVED')) ||
                !this.needsDrafting();
        }

        this.paymentComplete = function () {
            return this.sectionReached('paymentStatus',
                jobStatusPayment.get('FULLY_PAID'));
        }

        this.shippingComplete = function () {
            return this.sectionReached('shippingStatus',
                jobStatusShipment.get('RECEIVED')) ||
                !this.needsShipping();
        }

        this.isComplete = function () {
            return this.productionComplete() && this.draftingComplete() &&
                this.paymentComplete() && this.shippingComplete();
        }

        this.assignmentArrayIndexById = function (assignmentId) {
            return this.assignments().findIndex(function (assignment) {
                return assignmentId === assignment.id();
            });
        };

        this.setAssignment = function (assignment) {
            var assignmentIndex = this.assignmentArrayIndexById(
                assignment.id()),
                assignments = this.assignments();
            assignments[assignmentIndex] = assignment;
            return assignments;
        }

        this.assignmentBySupplier = function (supplier) {
            var assignments = this.assignmentsUnarchived(),
                i;
            for (i = 0; i < assignments.length; i++) {
                if (assignments[i].isUserSupplier(supplier)) {
                    return assignments[i];
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
            var assignments = this.assignmentsUnarchived(),
                supplierIds = [],
                i;
            for (i = 0; i < assignments.length; i++) {
                supplierIds.push(assignments[i].supplier().id());
            }
            return supplierIds;
        };

        this.updateDateOfAssignments = function (newDate, dateAttribute) {
            var assignments = this.assignmentsUnarchived(),
                i;
            for (i = 0; i < assignments.length; i++) {
                // new date should be in current user unix local time
                assignments[i][dateAttribute](newDate);
            }
            return assignments
        };

        this.firstAssignment = function () {
            return this.assignmentsUnarchived()[0];
        };

        this.productionShipment = function () {
            var acceptedAssignment = this.productionAcceptedAssignment();
            return Boolean(acceptedAssignment) ?
                acceptedAssignment.shipment() : null;
        };

        this.productionDeadline = function () {
            var firstAssignment = this.firstAssignment();
            return firstAssignment ?
                firstAssignment.productionDeadline() : null;
        };

        this.assignmentDeadline = function () {
            var firstAssignment = this.firstAssignment();
            return firstAssignment ?
                firstAssignment.assignmentDeadline() : null;
        }

        this.productionAssignmentDeadline = function () {
            return this.assignmentDeadline();
        };

        this.originalProduct = function () {
          var product = this.product(); 
          if (product) {
            var original = product.originalProduct();
            return original ? original : product;
          }
          return product;
        };

        this.draftsYoungestToEldest = function () {
            var drafts = this.drafts();
            return drafts ?
                sortArrayByObjectKeyDescending(drafts, 'date') : [];
        };

        this.draftsEldestToYoungest = function () {
            var drafts = this.drafts();
            return drafts ? sortArrayByObjectKey(drafts, 'date') : [];
        };

        this.currentDraft = function () {
            return this.draftsYoungestToEldest()[0];
        }

        this.draftIndexEldestToYoungest = function (draft) {
            return this.draftsEldestToYoungest().
                findIndex(function (draftEntity) {
                    return draft.id() === draftEntity.id();
                });
        }

        this.draftCommentsYoungestToEldest = function () {
            return sortArrayByObjectKeyDescending(this.draftComments(), 'date');
        }

        this.allDraftCommentsYoungestToEldest = function () {
            var jobDraftComments = this.draftCommentsYoungestToEldest(),
                drafts = this.draftsYoungestToEldest(),
                draftComments = [],
                i;
            for (i = 0; i < drafts.length; i++) {
                draftComments.concat(drafts[i].commentsYoungestToEldest());
            }
            return draftComments.concat(jobDraftComments);
        }

        this.activeDraft = function () {
            var drafts = this.draftsYoungestToEldest();
            return drafts.length > 0 ? drafts[0] : null;
        }

        this.shippingIsValid = function () {
            return this.shipping() && this.shipping().isValid();
        }

        this.userCanViewSection = function (user, allowedRoles) {
            var domain = this.domain();
            return domain ?
                user.hasAuthority(domain.id(), allowedRoles) : false;
        }

        this.isAdminOrManager = function (user) {
            return user.isAdminOrManager(this.domain().id());
        }

        this.isClient = function (user) {
            var clientId = this.client() ? this.client().id() : null;
            return clientId && user.id() === clientId;
        }

        this.userCanViewInfo = function (user) {
            var manager = roles.get('manager'),
                admin = roles.get('admin'),
                designer = roles.get('designer'),
                sales = roles.get('sales'),
                supplier = roles.get('supplier'),
                accountant = roles.get('accountant');
            return this.userCanViewSection(user,
                [manager, admin, designer, sales, supplier, accountant]);
        }

        this.userCanViewDrafting = function (user) {
            var client = roles.get('client'),
                manager = roles.get('manager'),
                admin = roles.get('admin'),
                designer = roles.get('designer');
            return this.userCanViewSection(user,
                [client, manager, admin, designer]);
        }

        this.userCanViewProduction = function (user) {
            var manager = roles.get('manager'),
                admin = roles.get('admin'),
                supplier = roles.get('supplier');
            return this.userCanViewSection(user,
                [manager, admin, supplier]);
        }

        this.userCanViewShipping = function (user) {
            var manager = roles.get('manager'),
                admin = roles.get('admin'),
                client = roles.get('client');
            return this.userCanViewSection(user,
                [manager, admin, client]);
        }

        this.userCanViewInvoice = function (user) {
            var manager = roles.get('manager'),
                admin = roles.get('admin'),
                accountant = roles.get('accountant');
            return this.userCanViewSection(user,
                [manager, admin, accountant]);
        }

        this.userHasRole = function (user, roles) {
            var domain = this.domain();
            return user.hasAuthority(domain.id(), roles);
        }

        this.tax = function () {
            var domain = this.domain();
            return domain && domain.company() ?
                domain.company().defaultTaxType() : null;
        }

        this.currency = function () {
            var domain = this.domain();
            return domain && domain.company() ?
                domain.company().defaultCurrency() : null;
        }

        this.isUserClient = function (user) {
            var client = this.client();
            return client && client.id() === user.id();
        }

        this.isUserManager = function (user) {
            var manager = this.manager();
            return manager && manager.id() === user.id();
        }

        this.isUserAdminOrManagerOfDomain = function (user) {
            var domain = this.domain();
            return domain ?
              user.isAdminOrManager(domain.id()) : false
        }

        this.isUserAssignmentSupplier = function (user) {
            var assignment = this.assignmentBySupplier(user);
            return assignment ? assignment.isUserSupplier(user) : false;
        }

        this.tryDeduct = function (success, error) {
            var request = new Request(),
                data = serialise(job)[0],
                query = new Dictionary(),
                self = this;
            query.add('embed', JSON.stringify({inventory: {}}));
            request.resource('/jobs/' + this.id() + '/deduct/');
            request.method('POST');
            request.data().merge(data);
            request.query().merge(query);
            function handleResponse(status, body) {
                var result = '';
                if (status === 200) {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'invalid json from server',
                                  errorCode: 0};
                        error(result);
                        return;
                    }
                    success(fromJson(self, result['job']));
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'could not deduct',
                                  errorCode: 0};
                    }
                    error(result);
                }
            }
            function handleError() {
                error({message: 'could not connect to server',
                       errorCode: 0});
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        }
    }

    function CartItem() {
        this.resource = '/cart_items';
        this.json = 'cartItem';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'creationDate');
        addPropertyTo(this, 'cart', Cart);
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'quantity');
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'product', Product);
        addPropertyTo(this, 'variations', Variation);
        addPropertyTo(this, 'variationsGroups', VariationsGroup);
        addPropertyTo(this, 'taxType', CountryTax);
        addPropertyTo(this, 'subtotalCost');
        addPropertyTo(this, 'totalCost');

        this.hasVariationsGroups = function () {
            var groups = this.variationsGroups();
            return groups && groups.length > 0;
        };

        this.create = function (success, error, embed, asDomain) {
            var self = this,
                data = serialise(self);
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: asDomain,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.calculate = function (success, error, embed) {
            var self = this,
                request = new Request(),
                data = serialise(this)[0];
            request.resource('/cart-item-cost-estimate/');
            request.method('POST');
            request.query().add('skip_rights', true);
            request.data().merge(data);
            function handleResponse(status, body) {
                var result = '';
                if (status === 201) {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'invalid json from server',
                                  errorCode: 0};
                    }
                    success(fromJson(new CartItem(), result));
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'could not get quote',
                                  errorCode: 0};
                    }
                    error(result);
                }
            }
            function handleError(status, data) {
                var responseData = data ? JSON.parse(data) :
                    {message: 'could not connect to server',
                       errorCode: 0}
                error(status, responseData);
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };

        this.requiresShipment = function() {
            var product = this.product();
            return product ? product.needsShipping() : false;
        };

    }

    function Cart() {
        this.resource = '/carts';
        this.json = 'cart';
        this.temporaryId = generateUUID();

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'token');
        addPropertyTo(this, 'ip');
        addPropertyTo(this, 'client', User);
        addPropertyTo(this, 'clientCompany', Company);
        addPropertyTo(this, 'creationDate');
        addPropertyTo(this, 'domain', Domain);
        addPropertyTo(this, 'subtotalCost');
        addPropertyTo(this, 'taxAmount');
        addPropertyTo(this, 'totalCost');
        addPropertyTo(this, 'cartItems', CartItem);
        addPropertyTo(this, 'cartItemsSubtotalCost');
        addPropertyTo(this, 'cartItemsTaxAmount');
        addPropertyTo(this, 'cartItemsTotalCost');
        addPropertyTo(this, 'shipmentSubtotalCost');
        addPropertyTo(this, 'shipmentTaxAmount');
        addPropertyTo(this, 'shipmentTotalCost');
        addPropertyTo(this, 'currency');
        addPropertyTo(this, 'receiverNotes');
        addPropertyTo(this, 'shipmentGroups', CartShipmentGroup);
        addPropertyTo(this, 'invoice', Invoice);
        addPropertyTo(this, 'shipment', Shipment);
        addPropertyTo(this, 'receiverAddress', Address);

        this.create = function (success, error, embed, asDomain) {
            var self = this,
                data = serialise(self);
            function handleResponse(result) {
                success(fromJson(self, result[self.json]));
            }
            create({resource: this.resource,
                    parameters: data[0],
                    as_domain: asDomain,
                    files: enumerateFiles(data[1]),
                    success: handleResponse,
                    error: error,
                    embed: embed});
        };

        this.get = function (success, error, embed, includeArchived,
                             withRights) {
            var self = this,
                parameters = {
                    cartToken: this.token(),
                    embed: embed,
                    error: error,
                    id: this.id(),
                    includeArchived: includeArchived,
                    withRights: withRights,
                    resource: this.resource};
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            parameters.success = handleResponse;
            getOne(parameters);
        };

        this.patch = function (success, error, embed) {
            var self = this,
                data = serialise(this, undefined, undefined, undefined,
                                 {excludeOld: true})[0];
            function handleResponse(result) {
                success(fromJson(self, result[self.json],
                                 {makesDirty: false}));
            }
            patchOne({cartToken: this.token(),
                      resource: this.resource,
                      id: this.id(),
                      success: handleResponse,
                      error: error,
                      data: data,
                      embed: embed});
        };

        this.getShipmentGroupsAndQuotes = function (success, error) {
            var self = this,
                request = new Request(),
                jsonBody;
            request.resource(`/generate-cart-shipment-quotes/${self.id()}/`);
            request.method('GET');
            request.query().add('cart_token', this.token());
            function handleResponse(status, body) {
                var result = '';
                if (status === 200) {
                    try {
                        jsonBody = JSON.parse(body);
                        success(fromJson(self, jsonBody, {makesDirty: false}));
                    } catch (e) {
                        result = {message: 'invalid json from server'};
                        error(null, result);
                    }
                } else {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        result = {message: 'Unable to duplicate product.'};
                    }
                    error(null, result);
                }
            }
            request.responseHandler(handleResponse).errorHandler(error);
            request.send();
        };

        this.requiresShipment = function () {
            var cartItems = this.cartItems() ? this.cartItems() : [],
                i;
            for (i = 0; i < cartItems.length; i++) {
                if (cartItems[i].requiresShipment()) {
                    return true;
                }
            }
        };

        this.stripePublishableKey = function () {
            return this.domain().company() ?
                this.domain().company().stripePublishableKey() : null;
        };

        this.stripeIsValidAndActive = function () {
            const company = this.domain().company();
            return this.stripePublishableKey() && company &&
                company.acceptStripe();
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
                success(fromJsonList(self, result,
                                     {makesDirty: false}));
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
                success(fromJsonList(self, result,
                                     {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function EmailCounters() {
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

    function Addresses() {
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
                var responseData = data ? JSON.parse(data) :
                    {message: 'could not connect to server',
                       errorCode: 0}
                error(status, responseData);
            }
            request.responseHandler(handleResponse).errorHandler(handleError);
            request.send();
        };
    }

    function Drafts() {
        this.resource = '/drafts';
        this.json = 'drafts';
        this.single = Draft;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result,
                                     {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function Users() {
        this.resource = '/users';
        this.json = 'users';
        this.single = User;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result,
                                     {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
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

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result,
                                     {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };

    }

    function ExchangeRates() {
        this.resource = '/exchange_rates';
        this.json = 'exchangeRates';
        this.single = ExchangeRate;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function SupplyDomains() {
        this.resource = '/supply_domains';
        this.json = 'supplyDomain';
        this.single = SupplyDomain;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
              success(fromJsonList(self, result,
                                   {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function Themes() {
        this.resource = '/themes';
        this.json = 'themes';
        this.single = Theme;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result,
                                     {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };

    }

    function Companies() {
        this.resource = '/companies';
        this.json = 'companies';
        this.single = Company;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result,
                                     {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function Categories() {
        this.resource = '/categories';
        this.json = 'categories';
        this.single = Category;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function CompanyInvitations() {
        this.resource = '/company_invitations';
        this.json = 'companyInvitations';
        this.single = CompanyInvitation;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function SubscriptionPlans() {
        this.resource = '/subscription_plans';
        this.json = 'subscriptionPlans';
        this.single = SubscriptionPlan;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function ComponentTags() {
        this.resource = '/component_tags';
        this.json = 'componentTags';
        this.single = ComponentTag;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function Components() {
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

    function DomainTags() {
        this.resource = '/domain_tags';
        this.json = 'domainTags';
        this.single = DomainTag;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function Inventories() {
        this.resource = '/inventories';
        this.json = 'inventories';
        this.single = Inventory;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
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
                success(fromJsonList(self, result, {makesDirty: false}));
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
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function QuoteItems() {
        this.resource = '/quote_items';
        this.json = 'quoteItems';
        this.single = QuoteItem;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function Quotes() {
        this.resource = '/quotes';
        this.json = 'quotes';
        this.single = Quote;

        this.get = function (success, error, offset, limit, q) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    {offset: offset, limit: limit, q: q});
        };
    }

    function Assignments() {
        this.resource = '/assignments';
        this.json = 'assignments';
        this.single = Assignment;

        this.get = function (success, error, parameters, withUpdates) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
              parameters, withUpdates);
        };
    }

    function Jobs() {
        this.resource = '/jobs';
        this.json = 'jobs';
        this.single = Job;

        this.get = function (success, error, parameters, withUpdates) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            return getList(this.resource, handleResponse, error, parameters,
                           withUpdates);
        };
    }

    function Notifications() {
        this.resource = '/notifications';
        this.json = 'notifications';
        this.single = Notification;

        this.get = function (success, error, queryObject) {
            var self = this;

            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }

            getList(this.resource, handleResponse, error, queryObject);
        };
    }

    function Backups() {
        this.resource = '/backups';
        this.json = 'backups';
        this.single = Backup;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    parameters);
        };
    }

    function MerchiFiles() {
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

    function Shipments() {
        this.resource = '/shipments';
        this.json = 'shipments';
        this.single = Shipment;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    parameters);
        };
    }

    function ShipmentMethods() {
        this.resource = '/shipment_methods';
        this.json = 'shipmentMethods';
        this.single = ShipmentMethod;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    parameters);
        };
    }

    function ShipmentMethodVariations() {
        this.resource = '/shipment_method_variations';
        this.json = 'shipmentMethodVariations';
        this.single = ShipmentMethodVariation;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error,
                    parameters);
        };
    }

    function Sessions() {
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

    function EnrolledDomains() {
        this.resource = '/enrolled_domains';
        this.json = 'enrolledDomains';
        this.single = EnrolledDomain;

        this.get = function (success, error, parameters) {
            var self = this;
            function handleResponse(result) {
                success(fromJsonList(self, result, {makesDirty: false}));
            }
            getList(this.resource, handleResponse, error, parameters);
        };
    }

    function toUnix(date) {
        return Math.floor(date.getTime() / 1000);
    }

    function forquoteEdit(rights) {
        var forbitEdit = false;
        if (rights.indexOf(MERCHI.rights.get("canEdit")) === -1) {
            forbitEdit = true;
        }
        return forbitEdit;
    }

    function forquoteDelete(rights) {
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
        request.query().add('skip_rights', true);
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server',
                              errorCode: 0};
                    error(result);
                    return;
                }
                success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not get quote',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
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
        request.query().add('skip_rights', true);
        function handleResponse(status, body) {
            var result = '';
            if (status === 201) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server',
                              errorCode: 0};
                    error(result);
                    return;
                }
                success(result);
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not get quote',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function getCurrentUser(success, error, embed) {
        var tokenStringForUser;
        if (!!window.loggedInUser && !embed) {
            success(window.loggedInUser);
            return;
        }
        function haveToken(token) {
            window.loggedInUser = token.user();
            success(window.loggedInUser);
        }
        try {
            tokenStringForUser = getCookie('session_token');
        } catch (e) {
            error(e);
        }
        if (!window.currentSession) {
            window.currentSession = new Session();
        }
        if (!embed) {
            embed = {};
        }
        if (Boolean(tokenStringForUser)) {
            window.currentSession.token(tokenStringForUser);
            window.currentSession.get(haveToken, error,
                               {'user': embed});
        }
    }

    function checkUserInfo(args) {
        var request = new Request(),
            data = new Dictionary();

        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server',
                              errorCode: 0};
                }
                args.success(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not recover the entity',
                              errorCode: 0};
                }
                args.error(result);
            }
        }
        function handleError() {
            args.error({message: 'could not connect to server',
                        errorCode: 0});
        }

        if (isNaN(args.user_id)) {
            args.error({message: 'User id is not a number.'});
        } else {
            data.add('subdomain', args.subdomain);
            data.add('name', args.user_name);
            data.add('email_address', args.user_email);
            request.data().merge(data);
            request.resource('/user-check/' + args.user_id + '/');
            request.method('POST');
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
        request.query().add('skip_rights', 'y');
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server',
                              errorCode: 0};
                    checkDictKeyForFunction(optionsDict,
                                            'error')(result);
                    return;
                }
                checkDictKeyForFunction(optionsDict,
                                        'success')(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not recover the entity',
                              errorCode: 0};
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
        request.query().add('skip_rights', 'y');
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'invalid json from server',
                              errorCode: 0};
                }
                success(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'could not recover the entity',
                              errorCode: 0};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
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
        return undefined;
    }

    function getUserIdByEmail(emailAddress, success, error) {
        var request = new Request(),
            data = new Dictionary(),
            result = '',
            errorCodeEmailNotFound = 5;
        request.resource('/user-check-email/');
        request.method('POST');
        data.add('email_address', emailAddress);
        request.data().merge(data);
        function handleResponse(status, body) {
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                    success(result);
                } catch (e) {
                    result = {message: 'Invalid json from server',
                              errorCode: 0};
                    error(status, result);
                    return;
                }
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Email not found.',
                              errorCode: errorCodeEmailNotFound};
                }
                error(status, result);
            }
        }
        function handleError(status, body) {
            try {
                result = JSON.parse(body);
            } catch (e) {
                result = {message: 'Invalid json from server',
                          errorCode: 0};
            }
            error(status, result);
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function placeOrder(clientId, quantity, product, address, variations,
                        success, error) {
        var request = new Request(),
            productId = product.id(),
            data = new Dictionary();
        data.add('client_id', clientId);
        data.add('quantity', quantity);
        data.add('product_id', productId);
        data.add('variation_notes', variations);
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
                    result = {message: 'Invalid json from server',
                              errorCode: 0};
                }
                success(JSON.parse(body));
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
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function getProductShipmentOptions(
        productId, quantity, address, success, error) {
        var request = new Request(),
            data = new Dictionary();
        data.add('quantity', quantity);
        data = serialise(address, data, 'address')[0];
        request.resource(`/shipments-for-product/${productId}/`);
        request.method('POST');
        request.data().merge(data);
        function handleResponse(status, body) {
            var result = '';
            if (status === 200) {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Invalid json from server',
                              errorCode: 0};
                }
                success(JSON.parse(body));
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {
                        message: 'Unable to fetch shipment options',
                        errorCode: 0};
                }
                error(result);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    if (!window.currentUser) getCurrentUser(id, id, currentUserEmbed);

    return {'roles': roles,
            'roleStrings': roleStrings,
            'systemRoles': systemRoles,
            'roleCssClass': roleCssClass,
            'eventTypes': eventTypes,
            'logout': logout,
            'canEditAttributes': canEditAttributes,
            'editAttributes': editAttributes,
            'forquoteEdit': forquoteEdit,
            'getRights': getRights,
            'forquoteDelete': forquoteDelete,
            'DEFAULT_RIGHTS': DEFAULT_RIGHTS,
            'jsonpHandlers': jsonpHandlers,
            'priorityLevels': priorityLevels,
            'URGENT_JOB_PRIORITY': priorityLevels.get('URGENT_JOB_PRIORITY'),
            'HIGH_JOB_PRIORITY': priorityLevels.get('HIGH_JOB_PRIORITY'),
            'MEDIUM_JOB_PRIORITY': priorityLevels.get('MEDIUM_JOB_PRIORITY'),
            'LOW_JOB_PRIORITY': priorityLevels.get('LOW_JOB_PRIORITY'),
            'priorityLevelsOptions': priorityLevelsOptions,
            'PhoneNumber': PhoneNumber,
            'Dictionary': Dictionary,
            'phoneNumbers': new PhoneNumbers(),
            'EmailAddress': EmailAddress,
            'emailAddresses': new EmailAddresses(),
            'EmailCounter': EmailCounter,
            'emailCounters': new EmailCounters(),
            'Address': Address,
            'addresses': new Addresses(),
            'User': User,
            'users': new Users(),
            'Domain': Domain,
            'domains': new Domains(),
            'DomainInvitation': DomainInvitation,
            'Draft': Draft,
            'drafts': new Drafts(),
            'DraftComment': DraftComment,
            'ExchangeRate': ExchangeRate,
            'exchangeRates': new ExchangeRates(),
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
            'Component': Component,
            'components': new Components(),
            'ComponentTag': ComponentTag,
            'componentTags': new ComponentTags(),
            'DomainTag': DomainTag,
            'domainTags': new DomainTags(),
            'Product': Product,
            'products': new Products(),
            'ProductionComment': ProductionComment,
            'Inventory': Inventory,
            'inventories': new Inventories(),
            'InventoryUnitVariation': InventoryUnitVariation,
            'matchiingInventory': MatchingInventory,
            'Invoice': Invoice,
            'invoices': new Invoices(),
            'Job': Job,
            'jobs': new Jobs(),
            'JobComment': JobComment,
            'Cart': Cart,
            'CartItem': CartItem,
            'Bank': Bank,
            'QuoteItem': QuoteItem,
            'QuoteItems': new QuoteItems(),
            'Quote': Quote,
            'Quotes': new Quotes(),
            'Assignment': Assignment,
            'Assignments': new Assignments(),
            'File': MerchiFile,
            'files': new MerchiFiles(),
            'Backup': Backup,
            'backups': new Backups(),
            'removeUnstoredFiles': removeUnstoredFiles,
            'Shipment': Shipment,
            'shipments': new Shipments(),
            'ShipmentMethod': ShipmentMethod,
            'shipmentMethods': new ShipmentMethods(),
            'ShipmentMethodVariation': ShipmentMethodVariation,
            'shipmentMethodVariations': new ShipmentMethodVariations(),
            'CountryTax': CountryTax,
            'countryTaxes': new CountryTaxes(),
            'Discount': Discount,
            'DiscountGroups': DiscountGroup,
            'SupplyDomain': SupplyDomain,
            'SupplyDomains': new SupplyDomains(),
            'getCurrentUser': getCurrentUser,
            'Payment': Payment,
            'Item': Item,
            'Session': Session,
            'sessions': new Sessions(),
            'serialise': serialise,
            'SystemRole': SystemRole,
            'toJson': toJson,
            'toJsonList': toJsonList,
            'rights': rights,
            'itemTypes': itemTypes,
            'Request': Request,
            'STATUS': STATUS,
            'GSTrate': GSTrate,
            'Notification': Notification,
            'notifications': new Notifications(),
            'SubscriptionPlan': SubscriptionPlan,
            'subscriptionPlans': new SubscriptionPlans(),
            'VariationField': VariationField,
            'Variation': Variation,
            'VariationsGroup': VariationsGroup,
            'VariationFieldsOption': VariationFieldsOption,
            'Menu': Menu,
            'MenuItem': MenuItem,
            'notificationTypes': notificationTypes,
            'paymentTypes': paymentTypes,
            'paymentTypeIds': paymentTypeIds,
            'Page': Page,
            'toUnix': toUnix,
            'id': id,
            'isUndefined': isUndefined,
            'isNull': isNull,
            'isUndefinedOrNull': isUndefinedOrNull,
            'indexOfEntityInArrayById': indexOfEntityInArrayById,
            'indexOfEntityInArrayByName': indexOfEntityInArrayByName,
            'jobStatusProduction': jobStatusProduction,
            'jobPriority': jobPriority,
            'notEmptyArray': notEmptyArray,
            'displayMoney': displayMoney,
            'sortArrayByObjectKey': sortArrayByObjectKey,
            'fromJson': fromJson,
            'fromJsonList': fromJsonList,
            'setSessionCookie': setSessionCookie,
            'setCartCookie': setCartCookie,
            'getQuote': getQuote,
            'checkAndUpdateNotifications': checkAndUpdateNotifications,
            'escapeHtml': escapeHtml,
            'getQueryStringValue': getQueryStringValue,
            'NoTaxEntity': NoTaxEntity,
            'notificationSectionCodes': notificationSectionCodes,
            'notificationSectionClass': notificationSectionClass,
            'notificationSectionIconClass': notificationSectionIconClass,
            'notificationSection': notificationSection,
            'notificationSectionKey': notificationSectionKey,
            'notificationAvatar': notificationAvatar,
            'fieldTypes': fieldTypes,
            'fieldTypesString': fieldTypesString,
            'inputTypes': inputTypes,
            'domainTypes': domainTypes,
            'getCookie': getCookie,
            'getCartCookie': getCartCookie,
            'getUserIdByEmail': getUserIdByEmail,
            'placeOrder': placeOrder,
            'platformName': platformName,
            'platfromSellerDomain': platfromSellerDomain,
            'platfromSellerDomainPlus': platfromSellerDomainPlus,
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
            'currentUserEmbed': currentUserEmbed,
            'create': create,
            'copyEnt': copyEnt,
            'copyEntIfNotNullOrUndefined': copyEntIfNotNullOrUndefined,
            'entAsBlank': entAsBlank,
            'cleanEntities': cleanEntities,
            'updateEntNonEmbeddableAttrbibutes': updateEntNonEmbeddableAttrbibutes,
            'updateEntAttributes': updateEntAttributes,
            'ignoreAttributesUpdateEnt': ignoreAttributesUpdateEnt,
            'inventoryStatuses': inventoryStatuses,
            'productTypes': productTypes,
            'productTypesInts': productTypesInts,
            'productTypesSeller': productTypesSeller,
            'getProductShipmentOptions': getProductShipmentOptions};
}
