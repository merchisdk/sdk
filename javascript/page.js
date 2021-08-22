import { addPropertyTo, serialise, enumerateFiles, fromJson,
    create } from './model';
import { isUndefinedOrNull } from './helpers';
import { Theme } from './theme';

export function Page() {
    this.resource = '/pages';
    this.json = 'page';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'slug');
    addPropertyTo(this, 'template');
    addPropertyTo(this, 'theme', Theme);

    this.text = function (text) {
        if (!isUndefinedOrNull(text)) {
            this.template(text);
        } else {
            return this.template();
        }
    };

    this.create = function (success, error, embed, domainId) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed,
                as_domain: domainId});
    };
}
