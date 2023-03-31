import { addPropertyTo, serialise, fromJson, create, enumerateFiles, getList,
    fromJsonList, getOne } from './model.js';
import { User } from './user.js';
import { CountryTax } from './country_tax.js';

export function SubscriptionPlan() {
    this.resource = '/subscription_plans';
    this.json = 'subscriptionPlan';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'created');
    addPropertyTo(this, 'updated');
    addPropertyTo(this, 'createdBy', User);
    addPropertyTo(this, 'updatedBy', User);
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'tax', CountryTax);
    addPropertyTo(this, 'baseCost');
    addPropertyTo(this, 'whiteLabelDomainCost');
    addPropertyTo(this, 'perSmsCost');
    addPropertyTo(this, 'perUserCost');
    addPropertyTo(this, 'perDomainCost');
    addPropertyTo(this, 'baseUserCount');
    addPropertyTo(this, 'baseDomainCount');
    addPropertyTo(this, 'billingCycleDays');
    addPropertyTo(this, 'isPrivate');

   this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: as_domain,
                files: enumerateFiles(data[1]),
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

export function SubscriptionPlans() {
    this.resource = '/subscription_plans';
    this.json = 'subscriptionPlans';
    this.single = SubscriptionPlan;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
