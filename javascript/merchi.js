import { generateUUID } from './uuid.js';
import { isNull, isUndefined, isUndefinedOrNull, id,
    notEmptyArray, isArray, removeObjectFromArrayWithIntegerValue,
    sortArrayByObjectKey, getGlobal } from './helpers.js';
import { addPropertyTo, serialise, fromJsonList, forEachProperty,
   fromJson, Request, create } from './model.js';
import { jobStatusProduction, jobPriority } from './job_status.js';
import { roles, systemRoles } from './roles.js';
import { domainTypes } from './domain_types.js';
import { productTypes, productTypesInts } from './product_types.js';
import { paymentTypes, paymentTypeIds } from './payment_types.js';
import { Dictionary } from './dictionary.js';
import { fieldTypes } from './field_types.js';
import { notificationTypes, notificationSectionCodes, notificationSection,
    notificationSectionKey, notificationSectionClass,
    notificationSectionIconClass } from './notification_types.js';
import { Address, Addresses } from './address.js';
import { Assignment, Assignments } from './assignment.js';
import {
    AutomaticPaymentRelationship,
    AutomaticPaymentRelationships,
} from './automatic_payment_relationship.js';
import { Backup, Backups } from './backup.js';
import { Bank } from './bank.js';
import { Category, Categories } from './category.js';
import { Cart } from './cart.js';
import { CartItem } from './cart_item.js';
import { CountryTax, CountryTaxes, NoTaxEntity } from './country_tax.js';
import { Company, Companies } from './company.js';
import { CompanyInvitation, CompanyInvitations } from './company_invitation.js';
import { Component, Components } from './component.js';
import { ComponentTag, ComponentTags } from './component_tag.js';
import { Discount } from './discount.js';
import { DiscountGroup } from './discount_group.js';
import { Domain, Domains } from './domain.js';
import { DomainTag, DomainTags } from './domain_tag.js';
import { DomainInvitation } from './domain_invitation.js';
import { Draft, Drafts } from './draft.js';
import { DraftTemplate } from './draft_template.js';
import { DraftComment } from './draft_comment.js';
import { EnrolledDomain, EnrolledDomains } from './enrolled_domain.js';
import { EmailAddress, EmailAddresses } from './email_address.js';
import { EmailCounter, EmailCounters } from './email_counter.js';
import { ExchangeRate, ExchangeRates } from './exchange_rate.js';
import { Item } from './item.js';
import { Inventory, Inventories } from './inventory.js';
import { InventoryUnitVariation } from './inventory_unit_variation.js';
import { MatchingInventory } from './matching_inventory.js';
import { Notification, Notifications } from './notification.js';
import { Invoice, Invoices } from './invoice.js';
import { Job, Jobs } from './job.js';
import { JobComment } from './job_comment.js';
import { MerchiFile, MerchiFiles } from './merchi_file.js';
import { Menu } from './menu.js';
import { MenuItem } from './menu_item.js';
import { Page } from './page.js';
import { Payment } from './payment.js';
import { Product, Products } from './product.js';
import { ProductionComment } from './production_comment.js';
import { PhoneNumber, PhoneNumbers } from './phone_number.js';
import { Session, Sessions } from './session.js';
import { Shipment, Shipments } from './shipment.js';
import { ShipmentMethod, ShipmentMethods } from './shipment_method.js';
import { ShipmentMethodVariation, ShipmentMethodVariations } from
    './shipment_method_variation.js';
import { SubscriptionPlan, SubscriptionPlans } from './subscription_plan.js';
import { SupplyDomain, SupplyDomains } from './supply_domain.js';
import { SystemRole } from './system_role.js';
import { Theme, Themes } from './theme.js';
import { User, Users } from './user.js';
import { UserCompany } from './user_company.js';
import { Variation } from './variation.js';
import { VariationField } from './variation_field.js';
import { VariationFieldsOption } from './variation_fields_option.js';
import { VariationsGroup } from './variations_group.js';
import { QuoteItem, QuoteItems } from './quote_item.js';
import { Quotes, Quote } from './quote.js';

export function merchi(backendUri, websocketUri) {
    getGlobal().merchiJsonpHandlers = {};
    getGlobal().merchiBackendUri = backendUri;
    getGlobal().merchiSubscriptionManager = new SubscriptionManager();

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

    function displayMoney(amount) {
        return parseFloat(amount).toFixed(2);
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
        priorityLevels = new Dictionary(),
        priorityLevelsOptions = new Dictionary(),
        shipmentCompanies = new Dictionary(),
        productTypesSeller = new Dictionary(),
        notificationAvatar = new Dictionary(),
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
        platformName = 'Merchi',
        platformCopyright = 2023,
        platformSellerDomain = 'merchi.co',
        platformSellerDomainPlus = 'merchi.co',
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
        DEFAULT_RIGHTS = [];

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

    inventoryStatuses.add("DEDUCTED", 0)
    inventoryStatuses.add("CAN_DEDUCT", 1)
    inventoryStatuses.add("NOT_SUFFICIENT", 2)
    inventoryStatuses.add("NO_MATCHING_INVENTORY", 3)

    productTypesSeller.add(2, 'seller');
    productTypesSeller.add(3, 'seller (made on demand)');

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
        } else {
            cookie += '; Domain=' + '.' + location.hostname;
        }
        cookie += '; path=/';
        document.cookie = cookie;
    }

    function setCartCookie(storeId, cart, domain) {
        var cookieValue = cart ? cart.id() + ',' + cart.token() : '';
        setSessionCookie('cart-' + String(storeId), cookieValue, domain);
    }

    function logout() {
        if (Boolean(getGlobal().currentSession)) {
            getGlobal().currentSession.remove(id, id);
            getGlobal().loggedInUser = null;
            getGlobal().currentSession = null;
        }
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

    function toUnix(date) {
        return Math.floor(date.getTime() / 1000);
    }

    function forquoteEdit(rights) {
        var forbitEdit = false;
        if (rights.indexOf(rights.get("canEdit")) === -1) {
            forbitEdit = true;
        }
        return forbitEdit;
    }

    function forquoteDelete(rights) {
        var forbitDelete = false;
        if (rights.indexOf(rights.get("canDelete")) === -1) {
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
        if (rights.indexOf(rights.get("canEdit")) !== -1) {
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
        function handleResponse(status, data) {
            if (status === 200) {
                success(data);
            } else {
                error(data);
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
        var slimProduct = new Product().id(job.product().id()),
            slimJob = job.domain(new Domain()).product(slimProduct),
            request = new Request(),
            data = serialise(slimJob)[0];
        request.resource('/specialised-order-estimate/');
        request.method('POST');
        request.data().merge(data);
        request.query().add('skip_rights', true);
        // add this to helping backend to know what the product id is
        request.query().add('product_id', job.product().id());
        function handleResponse(status, data) {
            if (status === 201) {
                success(data);
            } else {
                error(data);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    function initSessionByToken(tokenStringForUser, success, error, embed) {
        if (!getGlobal().currentSession) {
            getGlobal().currentSession = new Session();
        }
        if (!embed) {
            embed = {};
        }

        getGlobal().currentSession.token(tokenStringForUser).
            get(success, error, {'user': embed});
    }

    function getCurrentUser(success, error, embed) {
        var tokenStringForUser;
        if (!!getGlobal().loggedInUser && !embed) {
            success(getGlobal().loggedInUser);
            return;
        }
        function haveToken(token) {
            getGlobal().loggedInUser = token.user();
            success(getGlobal().loggedInUser);
        }
        try {
            tokenStringForUser = getCookie('session_token');
        } catch (e) {
            error(e);
        }
        if (Boolean(tokenStringForUser)) {
            initSessionByToken(tokenStringForUser, haveToken, error, embed);
        }
    }


    function checkUserInfo(args) {
        var request = new Request(),
            data = new Dictionary();

        function handleResponse(status, data) {
            if (status === 200) {
                args.success(data);
            } else {
                args.error(data);
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
        function handleResponse(status, data) {
            if (status === 200) {
                checkDictKeyForFunction(optionsDict, 'success')(data);
            } else {
                checkDictKeyForFunction(optionsDict, 'error')(data);
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
        function handleResponse(status, data) {
            if (status === 200) {
                success(data);
            } else {
                error(data);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();

      getGlobal().merchiSubscriptionManager.subscribe(
        [eventTypes.get('POST')], request.path(), "POST", handleResponse);
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
        var query = getGlobal().location.search.substring(1),
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
            data = new Dictionary();
        request.resource('/user-check-email/');
        request.method('POST');
        data.add('email_address', emailAddress);
        request.data().merge(data);
        function handleResponse(status, data) {
            if (status === 200) {
                success(data);
            } else {
                error(status, data);
            }
        }
        request.responseHandler(handleResponse).errorHandler(error);
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
        function handleResponse(status, data) {
            if (status === 200) {
                success(data);
            } else {
                error(data);
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
        request.resource(`/products/${productId}/shipment_options/`);
        request.method('POST');
        request.data().merge(data);
        function handleResponse(status, data) {
            if (status === 200) {
                success(data);
            } else {
                error(data);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    if (!getGlobal().currentUser) getCurrentUser(id, id, currentUserEmbed);

    return {'roles': roles,
            'roleStrings': roleStrings,
            'systemRoles': systemRoles,
            'roleCssClass': roleCssClass,
            'eventTypes': eventTypes,
            'getGlobal': getGlobal,
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
            'DraftTemplate': DraftTemplate,
            'ExchangeRate': ExchangeRate,
            'exchangeRates': new ExchangeRates(),
            'Theme': Theme,
            'themes': new Themes(),
            'EnrolledDomain': EnrolledDomain,
            'enrolledDomains': new EnrolledDomains(),
            'AutomaticPaymentRelationship': AutomaticPaymentRelationship,
            'automaticPaymentRelationships': new AutomaticPaymentRelationships(),
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
            'initSessionByToken': initSessionByToken,
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
            'platformSellerDomain': platformSellerDomain,
            'platformSellerDomainPlus': platformSellerDomainPlus,
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
