import { Dictionary } from './dictionary';
import { any } from './helpers';


export const showUserAvatarArray =
            ['DRAFT_SENT', 'DRAFT_CHANGE_REQUEST', 'DRAFT_APPROVED',
             'DRAFT_COMMENT', 'JOB_COMMENT', 'PRODUCTION_COMMENT',
             'PRODUCTION_FILE_UPLOADED', 'PRODUCTION_FINISHED',
             'PRODUCTION_COMMENCED', 'QUOTE_APPROVED', 'SHIPMENT_UPDATE',
             'JOB_FILE_UPLOADED'];

export const showDomainAvatarArray =
            ['NO_TYPE', 'DESIGNER_ASSIGNED', 'DESIGNER_CHANGED',
             'SEND_INVOICE', 'JOB_STALE', 'MANAGER_ASSIGNED', 'ORDER_RECEIVED',
             'CLIENT_CHANGED', 'PRODUCTION_CANCELLED', 'QUOTE_FAILED',
             'QUOTE_COMMENCED', 'QUOTE_EXPIRED', 'SUPPLIER_ASSIGNED',
             'READY_FOR_SHIPPING', 'SIGN_UP_CONFIRMATION', 'CRASH_EVENT',
             'MANAGER_SUMMARY', 'PASSWORD_RESET', 'MANAGER_REASSIGNED',
             'EMAIL_RESPONSE', 'SHIPMENT_EXPECTED_DATE_PAST',
             'DOMAIN_INVITATION', 'MOD_SELLER_SUMMARY', 'MOD_SUPPLIER_SUMMARY'];

export const showUserOrDomainAvatarArray =
            ['JOB_PAID', 'INVOICE_PAID', 'PAYMENT_ACCEPTED',
             'AUTOMATIC_JOB_RESPONSE', 'JOB_NOTIFICATION', 'JOB_REMINDER',
             'GENERAL_REMINDER', 'INVOICE_EMAIL_RESPONSE',
             'AUTOMATIC_INVOICE_RESPONSE', 'JOB_ADDED_TO_SHIPMENT',
             'JOB_REMOVED_FROM_SHIPMENT', 'ASSIGNMENT_REMOVED_FROM_SHIPMENT',
             'SHIPMENT_EXPECTED_DATE_PAST', 'ASSIGNMENT_ADDED_TO_SHIPMENT'];

export const showDomainOrUserAvatarArray =
            ['SHIPMENT_DISPATCH_CLOSE', 'SHIPMENT_NOT_DISPATCHED',
             'SHIPMENT_EXPECTED_DATE_WARNING', 'SHIPMENT_EXPECTED_DATE_PAST'];

export const notificationTypes = new Dictionary();

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
notificationTypes.add("CREATE_DOMAIN_FOR_MOD_PRODUCT", 63);
notificationTypes.add("RESELL_REQUEST_SUBMITTED", 64);
notificationTypes.add("RESELL_REQUEST_RECEIVED", 65);
notificationTypes.add("MOD_PRODUCT_READY_FOR_SALE", 66);
notificationTypes.add("ADDED_TO_COMPANY", 67);
notificationTypes.add("PRODUCTION_COMPLETED", 68);
notificationTypes.add("SUPPLIER_PRODUCT_READY_FOR_SALE", 69);
notificationTypes.add("STORE_ASSIGNED_TO_YOU", 70);
notificationTypes.add("CLIENT_STORE_CREATED", 71);
notificationTypes.add("MOD_SELLER_SUMMARY", 72);
notificationTypes.add("MOD_SUPPLIER_SUMMARY", 73);

export const notificationTypesKeys = new Dictionary();

notificationTypes.each(function (key, value) {
    notificationTypesKeys.add(value, key);
});

export const notificationAvatar = new Dictionary();

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

export function notificationsFilter(notificationsArray, filterObjectArray) {
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

export function notificationRecieverIsCurrentUserFilter(currentUser,
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

export function isAvatarTypeInNotificationAvatar(avatarTypeString, noteType) {
    var avatarType = notificationAvatar.get(avatarTypeString);
    return any(avatarType, function (type) { return type === noteType; });
}

export const notificationSection = new Dictionary();

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

export const notificationSectionKey = new Dictionary();

notificationSection.each(function (key, value) {
    notificationSectionKey.add(value, key);
});

export const notificationSectionClass = new Dictionary();

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

export const notificationSectionIconClass = new Dictionary();

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

export const notificationSectionCodes = new Dictionary();

notificationSection.each(function (key, value) {
    notificationSectionCodes.add(value, parseInt(key, 10));
});

