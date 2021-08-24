import moment from 'moment-timezone';
import { generateUUID } from './uuid.js';
import { isNull, isUndefined, isUndefinedOrNull, id,
    notEmptyArray, isArray, removeObjectFromArrayWithIntegerValue } from './helpers.js';
import { addPropertyTo, serialise, getList, fromJsonList, forEachProperty,
   fromJson, patchOne, Request, getOne, create, deleteOne,
   enumerateFiles } from './model.js';
import { roles, systemRoles } from './roles';
import { domainTypes } from './domain_types';
import { productTypes, productTypesInts } from './product_types';
import { Dictionary } from './dictionary.js';
import { fieldTypes } from './field_types';
import { Address, Addresses } from './address.js';
import { Bank } from './bank.js';
import { Category, Categories } from './category';
import { CountryTax, CountryTaxes, NoTaxEntity } from './country_tax';
import { Company, Companies } from './company';
import { CompanyInvitation, CompanyInvitations } from './company_invitation';
import { DiscountGroup } from './discount_group';
import { Domain, Domains } from './domain';
import { DomainTag, DomainTags } from './domain_tag';
import { DomainInvitation } from './domain_invitation';
import { EnrolledDomain, EnrolledDomains } from './enrolled_domain';
import { EmailAddress, EmailAddresses } from './email_address.js';
import { EmailCounter, EmailCounters } from './email_counter.js';
import { Inventory, Inventories } from './inventory';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { MerchiFile, MerchiFiles } from './merchi_file';
import { Menu } from './menu';
import { MenuItem } from './menu_item';
import { Page } from './page';
import { Product, Products } from './product';
import { PhoneNumber, PhoneNumbers } from './phone_number.js';
import { ShipmentMethod, ShipmentMethods } from './shipment_method';
import { ShipmentMethodVariation, ShipmentMethodVariations } from
    './shipment_method_variation';
import { SupplyDomain, SupplyDomains } from './supply_domain';
import { SystemRole } from './system_role';
import { Theme, Themes } from './theme';
import { User, Users } from './user';
import { UserCompany } from './user_company';
import { Variation } from './variation';
import { VariationField } from './variation_field';
import { VariationFieldsOption } from './variation_fields_option';
import { VariationsGroup } from './variations_group';

export function merchi(backendUri, websocketUri) {
    window.merchiJsonpHandlers = {};
    window.merchiBackendUri = backendUri;
    window.merchiSubscriptionManager = new SubscriptionManager();

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

    function displayMoney(amount) {
        return parseFloat(amount).toFixed(2);
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
    var roleStrings = new Dictionary(),
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
        themeFoundation = new Dictionary(),
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
        platformName = 'merchi',
        platformCopyright = 2021,
        platfromSellerDomain = 'merchi.me',
        platfromSellerDomainPlus = 'merchi.store',
        backendImgUri = backendUri + 'static/img/',
        platformIcon = backendImgUri + 'merchi-monster-blue.png',
        platformLogo = backendImgUri + 'merchi-master-colour-with-monster.png',
        defaultUserAvatar = backendImgUri + 'default-user-32px.jpg',
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

    roles.each(function (key, value) {
        roleStrings.add(value, key);
    });

    roleCssClass.add(roles.get('public'), 'default');
    roleCssClass.add(roles.get('admin'), 'inverse');
    roleCssClass.add(roles.get('sales'), 'success');
    roleCssClass.add(roles.get('designer'), 'success');
    roleCssClass.add(roles.get('supplier'), 'warning');
    roleCssClass.add(roles.get('client'), 'danger');
    roleCssClass.add(roles.get('manager'), 'primary');
    roleCssClass.add(roles.get('accountant'), 'info');

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
        var avatarType = notificationAvatar.get(avatarTypeString);
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
        var updatedEnt = updateEntNonEmbeddableAttrbibutes(ent, newEnt),
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
        var updatedEnt = newEnt,
            i;
        for (i = 0; i < ignoredAttrs.length; i++) {
            var attributeName = ignoredAttrs[i];
            updatedEnt[attributeName](ent[attributeName]());
        }
       return updatedEnt;
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

    function Backup() {
        this.resource = '/backups';
        this.json = 'backup';

        addPropertyTo(this, 'id');
        addPropertyTo(this, 'file', MerchiFile);

        this.destroy = function (success, error) {
            deleteOne(this.resource + "/" + this.id(), success, error);
        };
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
        var idAndToken = getCookie('cart-' + String(storeId), null);
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

    function removeUnstoredFiles(files, removeAll) {
        var count = 1, i;

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
                total = parseFloat(0.000), i;
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
                                 {makesDirty: false}));
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
                data = serialise(this)[0],
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
            var request = new Request(),
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

        window.merchiSubscriptionManager.subscribe([eventTypes.get('POST')], request.path(),
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
