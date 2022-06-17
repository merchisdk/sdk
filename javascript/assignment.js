import { generateUUID } from './uuid';
import { addPropertyTo, fromJson, create, serialise, enumerateFiles, getList,
    patchOne, fromJsonList, getOne } from './model';
import { notificationTypes, notificationRecieverIsCurrentUserFilter,
   notificationsFilter } from './notification_types';
import { Job } from './job';
import { User } from './user';
import { Notification } from './notification';
import { Quote } from './quote';
import { Shipment } from './shipment';
import { SupplyDomain } from './supply_domain';
import { ProductionComment } from './production_comment';

export function Assignment() {
    this.resource = '/assignments';
    this.json = 'assignment';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'managerAccepts');
    addPropertyTo(this, 'supplierRefused');
    addPropertyTo(this, 'productionDeadline');
    addPropertyTo(this, 'assignmentDeadline');
    addPropertyTo(this, 'needsDrafting');
    addPropertyTo(this, 'needsShipping');
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

export function Assignments() {
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
