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
import { Company } from './company';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Theme } from './theme';
var Domain = /** @class */ (function (_super) {
    __extends(Domain, _super);
    function Domain() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultCurrency = function () {
            if (_this.company === undefined) {
                throw new Error('company is undefined, did you forget to embed it?');
            }
            if (_this.company.defaultCurrency === undefined) {
                var err = 'company.defaultCurrency is undefined, did you forget to' +
                    ' embed it?';
                throw new Error(err);
            }
            return _this.company.defaultCurrency;
        };
        _this.defaultTaxType = function () {
            if (_this.company === undefined) {
                throw new Error('company is undefined, did you forget to embed it?');
            }
            if (_this.company.defaultTaxType === undefined) {
                var err = 'company.defaultTaxType is undefined, did you forget to' +
                    ' embed it?';
                throw new Error(err);
            }
            return _this.company.defaultTaxType;
        };
        return _this;
    }
    Domain.resourceName = 'domains';
    Domain.singularName = 'domain';
    Domain.pluralName = 'domains';
    __decorate([
        Domain.property({ type: Date }),
        __metadata("design:type", Object)
    ], Domain.prototype, "archived", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Number)
    ], Domain.prototype, "id", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", String)
    ], Domain.prototype, "domain", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Boolean)
    ], Domain.prototype, "isMaster", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Number)
    ], Domain.prototype, "domainType", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", String)
    ], Domain.prototype, "subDomain", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", String)
    ], Domain.prototype, "emailDomain", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", String)
    ], Domain.prototype, "smsName", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Boolean)
    ], Domain.prototype, "showDomainPublicly", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Boolean)
    ], Domain.prototype, "enableEmailNotifications", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Boolean)
    ], Domain.prototype, "enableSmsNotifications", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Array)
    ], Domain.prototype, "mailgunRecords", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Boolean)
    ], Domain.prototype, "enableNotifications", void 0);
    __decorate([
        Domain.property({ type: String }),
        __metadata("design:type", Object)
    ], Domain.prototype, "conversionTrackingCode", void 0);
    __decorate([
        Domain.property({ type: String }),
        __metadata("design:type", Object)
    ], Domain.prototype, "newConversionTrackingCode", void 0);
    __decorate([
        Domain.property({ type: String }),
        __metadata("design:type", Object)
    ], Domain.prototype, "newGlobalTrackingCode", void 0);
    __decorate([
        Domain.property({ type: String }),
        __metadata("design:type", Object)
    ], Domain.prototype, "apiSecret", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Company)
    ], Domain.prototype, "company", void 0);
    __decorate([
        Domain.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], Domain.prototype, "logo", void 0);
    __decorate([
        Domain.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], Domain.prototype, "favicon", void 0);
    __decorate([
        Domain.property(),
        __metadata("design:type", Theme)
    ], Domain.prototype, "activeTheme", void 0);
    __decorate([
        Domain.property({ arrayType: 'DomainTag' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "tags", void 0);
    __decorate([
        Domain.property({ arrayType: 'Domain' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "canSupply", void 0);
    __decorate([
        Domain.property({ arrayType: 'Domain' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "suppliedBy", void 0);
    __decorate([
        Domain.property({ arrayType: 'Menu' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "menus", void 0);
    __decorate([
        Domain.property({ arrayType: 'Session' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "sessions", void 0);
    __decorate([
        Domain.property({ arrayType: 'Category' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "categories", void 0);
    __decorate([
        Domain.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "notifications", void 0);
    __decorate([
        Domain.property({ arrayType: 'Product' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "products", void 0);
    __decorate([
        Domain.property({ arrayType: 'SupplyDomain' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "supplyProducts", void 0);
    __decorate([
        Domain.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "jobs", void 0);
    __decorate([
        Domain.property({ arrayType: 'User' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "jobsAssignees", void 0);
    __decorate([
        Domain.property({ arrayType: 'Cart' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "carts", void 0);
    __decorate([
        Domain.property({ arrayType: 'EnrolledDomain' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "enrollments", void 0);
    __decorate([
        Domain.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "invoices", void 0);
    __decorate([
        Domain.property({ arrayType: 'DomainInvitation' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "domainInvitations", void 0);
    __decorate([
        Domain.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], Domain.prototype, "themes", void 0);
    return Domain;
}(Entity));
export { Domain };
