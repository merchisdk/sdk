import { addPropertyTo, serialise, fromJsonList, getList, getOne,
   fromJson, patchOne } from './model';
import { sortArrayByObjectKeyDescending, isUndefined } from './helpers';
import { Job } from './job';
import { User } from './user';
import { DraftComment } from './draft_comment';
import { MerchiFile } from './merchi_file';

export function Draft() {
    this.resource = '/drafts';
    this.json = 'draft';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'sharedWithJob', Job);
    addPropertyTo(this, 'designer', User);
    addPropertyTo(this, 'file', MerchiFile);
    addPropertyTo(this, 'date');
    addPropertyTo(this, 'accepted');
    addPropertyTo(this, 'changesRequested');
    addPropertyTo(this, 'resendDate');
    addPropertyTo(this, 'viewed');
    addPropertyTo(this, 'justViewed');
    addPropertyTo(this, 'comments', DraftComment);
    addPropertyTo(this, 'commentsCount');
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

export function Drafts() {
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
