import { generateUUID } from './uuid';
import { addPropertyTo, enumerateFiles, fromJson, create,
    serialise } from './model';
import { Job } from './job';
import { User } from './user';
import { MerchiFile } from './merchi_file';
import { Notification } from './notification';

export function JobComment() {
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
