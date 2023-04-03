import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, patchOne, enumerateFiles, getList,
    fromJson, getOne, create, fromJsonList } from './model.js';
import { isAvatarTypeInNotificationAvatar, notificationTypesKeys,
    notificationSectionIconClass } from './notification_types.js';
import { User } from './user.js';
import { Domain } from './domain.js';
import { Job } from './job.js';
import { MerchiFile } from './merchi_file.js';
import { DraftComment } from './draft_comment.js';
import { JobComment } from './job_comment.js';
import { ProductionComment } from './production_comment.js';
import { Invoice } from './invoice.js';

export function Notification() {
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

export function Notifications() {
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
