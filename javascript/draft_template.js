import { addPropertyTo, serialise, create, enumerateFiles,
    fromJson } from './model';
import { Job } from './job';
import { Product } from './product';
import { MerchiFile } from './merchi_file';

export function DraftTemplate() {
    this.resource = '/draft_comments';
    this.json = 'draftComment';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'product', Product);
    addPropertyTo(this, 'file', MerchiFile);
    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'date');
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'height');
    addPropertyTo(this, 'width');

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
