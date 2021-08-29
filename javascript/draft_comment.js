import { addPropertyTo, serialise, create, enumerateFiles,
    fromJson } from './model';
import { Draft } from './draft';
import { Job } from './job';
import { User } from './user';
import { Notification } from './notification';
import { MerchiFile } from './merchi_file';

export function DraftComment() {
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
