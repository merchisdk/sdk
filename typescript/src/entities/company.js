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
import { CountryTax } from './country_tax';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { SubscriptionPlan } from './subscription_plan';
var Company = /** @class */ (function (_super) {
    __extends(Company, _super);
    function Company() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Company.resourceName = 'companies';
    Company.singularName = 'company';
    Company.pluralName = 'companies';
    __decorate([
        Company.property({ type: Date }),
        __metadata("design:type", Object)
    ], Company.prototype, "archived", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", Number)
    ], Company.prototype, "id", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", String)
    ], Company.prototype, "name", void 0);
    __decorate([
        Company.property({ type: String }),
        __metadata("design:type", Object)
    ], Company.prototype, "website", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", Boolean)
    ], Company.prototype, "temporaryCreated", void 0);
    __decorate([
        Company.property({ type: String }),
        __metadata("design:type", Object)
    ], Company.prototype, "taxNumber", void 0);
    __decorate([
        Company.property({ type: Number }),
        __metadata("design:type", Object)
    ], Company.prototype, "taxNumberType", void 0);
    __decorate([
        Company.property({ type: String }),
        __metadata("design:type", Object)
    ], Company.prototype, "paypalAccount", void 0);
    __decorate([
        Company.property({ type: String }),
        __metadata("design:type", Object)
    ], Company.prototype, "paypalPassword", void 0);
    __decorate([
        Company.property({ type: String }),
        __metadata("design:type", Object)
    ], Company.prototype, "paypalSignature", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", Boolean)
    ], Company.prototype, "isPaypalValid", void 0);
    __decorate([
        Company.property({ type: String }),
        __metadata("design:type", Object)
    ], Company.prototype, "stripePublishableKey", void 0);
    __decorate([
        Company.property({ type: String }),
        __metadata("design:type", Object)
    ], Company.prototype, "stripeApiKey", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", Boolean)
    ], Company.prototype, "isStripeValid", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", Boolean)
    ], Company.prototype, "acceptStripe", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", Boolean)
    ], Company.prototype, "acceptPaypal", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", Boolean)
    ], Company.prototype, "acceptBankTransfer", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", Boolean)
    ], Company.prototype, "acceptPhonePayment", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", String)
    ], Company.prototype, "defaultCurrency", void 0);
    __decorate([
        Company.property(),
        __metadata("design:type", String)
    ], Company.prototype, "country", void 0);
    __decorate([
        Company.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], Company.prototype, "logo", void 0);
    __decorate([
        Company.property({ type: CountryTax }),
        __metadata("design:type", Object)
    ], Company.prototype, "defaultTaxType", void 0);
    __decorate([
        Company.property({ type: SubscriptionPlan }),
        __metadata("design:type", Object)
    ], Company.prototype, "subscriptionPlan", void 0);
    __decorate([
        Company.property({ arrayType: 'EmailAddress' }),
        __metadata("design:type", Array)
    ], Company.prototype, "_emailAddresses", void 0);
    __decorate([
        Company.property({ arrayType: 'PhoneNumber' }),
        __metadata("design:type", Array)
    ], Company.prototype, "_paymentPhoneNumbers", void 0);
    __decorate([
        Company.property({ arrayType: 'PhoneNumber' }),
        __metadata("design:type", Array)
    ], Company.prototype, "_phoneNumbers", void 0);
    __decorate([
        Company.property({ arrayType: 'Address' }),
        __metadata("design:type", Array)
    ], Company.prototype, "_addresses", void 0);
    __decorate([
        Company.property({ arrayType: 'UserCompany' }),
        __metadata("design:type", Array)
    ], Company.prototype, "_users", void 0);
    __decorate([
        Company.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], Company.prototype, "shipmentsAsSender", void 0);
    __decorate([
        Company.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], Company.prototype, "shipmentsAsReceiver", void 0);
    __decorate([
        Company.property({ arrayType: 'Product' }),
        __metadata("design:type", Array)
    ], Company.prototype, "saved_products", void 0);
    __decorate([
        Company.property({ arrayType: 'Bank' }),
        __metadata("design:type", Array)
    ], Company.prototype, "banks", void 0);
    __decorate([
        Company.property({ arrayType: 'UserCompany' }),
        __metadata("design:type", Array)
    ], Company.prototype, "userCompanies", void 0);
    __decorate([
        Company.property({ arrayType: 'CompanyInvitation' }),
        __metadata("design:type", Array)
    ], Company.prototype, "companyInvitations", void 0);
    __decorate([
        Company.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], Company.prototype, "appliedJobs", void 0);
    __decorate([
        Company.property({ arrayType: 'Cart' }),
        __metadata("design:type", Array)
    ], Company.prototype, "carts", void 0);
    __decorate([
        Company.property({ arrayType: 'Domain' }),
        __metadata("design:type", Array)
    ], Company.prototype, "domains", void 0);
    __decorate([
        Company.property({ arrayType: 'EmailAddress' }),
        __metadata("design:type", Array)
    ], Company.prototype, "emailAddresses", void 0);
    __decorate([
        Company.property({ arrayType: 'PhoneNumber' }),
        __metadata("design:type", Array)
    ], Company.prototype, "phoneNumbers", void 0);
    __decorate([
        Company.property({ arrayType: 'PhoneNumber' }),
        __metadata("design:type", Array)
    ], Company.prototype, "paymentPhoneNumbers", void 0);
    __decorate([
        Company.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], Company.prototype, "invoicesHas", void 0);
    __decorate([
        Company.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], Company.prototype, "subscriptionInvoices", void 0);
    __decorate([
        Company.property({ arrayType: 'Address' }),
        __metadata("design:type", Array)
    ], Company.prototype, "addresses", void 0);
    return Company;
}(Entity));
export { Company };
