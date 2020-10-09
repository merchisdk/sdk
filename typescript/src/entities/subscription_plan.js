var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity } from '../entity';
import { CountryTax } from './country_tax';
import { User } from './user';
var SubscriptionPlan = /** @class */ (function (_super) {
    __extends(SubscriptionPlan, _super);
    function SubscriptionPlan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SubscriptionPlan.resourceName = 'subscription_plans';
    SubscriptionPlan.singularName = 'subscriptionPlan';
    SubscriptionPlan.pluralName = 'subscriptionPlans';
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "id", void 0);
    __decorate([
        SubscriptionPlan.property({ type: Date }),
        __metadata("design:type", Object)
    ], SubscriptionPlan.prototype, "created", void 0);
    __decorate([
        SubscriptionPlan.property({ type: Date }),
        __metadata("design:type", Object)
    ], SubscriptionPlan.prototype, "updated", void 0);
    __decorate([
        SubscriptionPlan.property({ type: User }),
        __metadata("design:type", Object)
    ], SubscriptionPlan.prototype, "createdBy", void 0);
    __decorate([
        SubscriptionPlan.property({ type: User }),
        __metadata("design:type", Object)
    ], SubscriptionPlan.prototype, "updatedBy", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", String)
    ], SubscriptionPlan.prototype, "name", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", String)
    ], SubscriptionPlan.prototype, "currency", void 0);
    __decorate([
        SubscriptionPlan.property({ type: CountryTax }),
        __metadata("design:type", Object)
    ], SubscriptionPlan.prototype, "tax", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "baseCost", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "whiteLabelDomainCost", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "perSmsCost", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "perUserCost", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "perDomainCost", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "baseUserCount", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "baseDomainCount", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Number)
    ], SubscriptionPlan.prototype, "billingCycleDays", void 0);
    __decorate([
        SubscriptionPlan.property(),
        __metadata("design:type", Boolean)
    ], SubscriptionPlan.prototype, "is_private", void 0);
    __decorate([
        SubscriptionPlan.property({ arrayType: 'Company' }),
        __metadata("design:type", Array)
    ], SubscriptionPlan.prototype, "companies", void 0);
    return SubscriptionPlan;
}(Entity));
export { SubscriptionPlan };
