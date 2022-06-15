import { generateUUID } from './uuid.js';
import { isNull, isUndefined, isUndefinedOrNull, id,
    notEmptyArray, isArray, removeObjectFromArrayWithIntegerValue,
    sortArrayByObjectKey } from './helpers.js';
import { addPropertyTo, serialise, fromJsonList, forEachProperty,
   fromJson, patchOne, Request, getOne, create, 
   enumerateFiles } from './model.js';
import { jobStatusProduction, jobPriority } from './job_status';
import { roles, systemRoles } from './roles';
import { domainTypes } from './domain_types';
import { productTypes, productTypesInts } from './product_types';
import { paymentTypes, paymentTypeIds } from './payment_types'
import { Dictionary } from './dictionary.js';
import { fieldTypes } from './field_types';
import { notificationTypes, notificationSectionCodes, notificationSection,
    notificationSectionKey, notificationSectionClass,
    notificationSectionIconClass } from './notification_types';
import { Address, Addresses } from './address';
import { Assignment, Assignments } from './assignment';
import {
    AutomaticPaymentRelationship,
    AutomaticPaymentRelationships,
} from './automatic_payment_relationship';
import { Backup, Backups } from './backup';
import { Bank } from './bank.js';
import { Category, Categories } from './category';
import { CountryTax, CountryTaxes, NoTaxEntity } from './country_tax';
import { Company, Companies } from './company';
import { CompanyInvitation, CompanyInvitations } from './company_invitation';
import { Component, Components } from './component';
import { ComponentTag, ComponentTags } from './component_tag';
import { Discount } from './discount';
import { DiscountGroup } from './discount_group';
import { Domain, Domains } from './domain';
import { DomainTag, DomainTags } from './domain_tag';
import { DomainInvitation } from './domain_invitation';
import { Draft, Drafts } from './draft';
import { DraftTemplate } from './draft_template';
import { DraftComment } from './draft_comment';
import { EnrolledDomain, EnrolledDomains } from './enrolled_domain';
import { EmailAddress, EmailAddresses } from './email_address.js';
import { EmailCounter, EmailCounters } from './email_counter.js';
import { ExchangeRate, ExchangeRates } from './exchange_rate';
import { Item } from './item';
import { Inventory, Inventories } from './inventory';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { MatchingInventory } from './matching_inventory';
import { Notification, Notifications } from './notification';
import { Invoice, Invoices } from './invoice';
import { Job, Jobs } from './job';
import { JobComment } from './job_comment';
import { MerchiFile, MerchiFiles } from './merchi_file';
import { Menu } from './menu';
import { MenuItem } from './menu_item';
import { Page } from './page';
import { Payment } from './payment';
import { Product, Products } from './product';
import { ProductionComment } from './production_comment';
import { PhoneNumber, PhoneNumbers } from './phone_number.js';
import { Session, Sessions } from './session';
import { Shipment, Shipments } from './shipment';
import { ShipmentMethod, ShipmentMethods } from './shipment_method';
import { ShipmentMethodVariation, ShipmentMethodVariations } from
    './shipment_method_variation';
import { SubscriptionPlan, SubscriptionPlans } from './subscription_plan';
import { SupplyDomain, SupplyDomains } from './supply_domain';
import { SystemRole } from './system_role';
import { Theme, Themes } from './theme';
import { User, Users } from './user';
import { UserCompany } from './user_company';
import { Variation } from './variation';
import { VariationField } from './variation_field';
import { VariationFieldsOption } from './variation_fields_option';
import { VariationsGroup } from './variations_group';
import { QuoteItem, QuoteItems } from './quote_item';
import { Quotes, Quote } from './quote';

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
        if (Boolean(window.currentSession)) {
            window.currentSession.remove(id, id);
            window.loggedInUser = null;
            window.currentSession = null;
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
