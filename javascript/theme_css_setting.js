import { addPropertyTo, serialise, fromJson, create, getList,
    fromJsonList, getOne } from './model';
import { User } from './user';

export function ThemeCssSetting() {
    this.resource = '/theme_css_settings';
    this.json = 'themeCssSetting';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'created');
    addPropertyTo(this, 'createdBy', User);
    addPropertyTo(this, 'allowedAttributes');
    addPropertyTo(this, 'notAllowedAttributes');

   this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: as_domain,
                success: handleResponse,
                error: error,
                embed: embed});
    };

    this.get = function (success, error) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error});
    };
}

export function ThemeCssSetting() {
    this.resource = '/theme_css_settings';
    this.json = 'themeCssSettings';
    this.single = SubscriptionPlan;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
