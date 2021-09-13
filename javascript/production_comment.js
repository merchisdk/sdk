import { addPropertyTo, enumerateFiles, create, serialise,
    fromJson } from './model';
import { Assignment } from './assignment';
import { User } from './user';
import { MerchiFile } from './merchi_file';
import { Notification } from './notification';

export function ProductionComment() {
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
