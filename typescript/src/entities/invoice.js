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
import { Address } from './address';
import { Cart } from './cart';
import { Company } from './company';
import { Domain } from './domain';
import { EmailAddress } from './email_address';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { PhoneNumber } from './phone_number';
import { User } from './user';
var Invoice = /** @class */ (function (_super) {
    __extends(Invoice, _super);
    function Invoice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Invoice.resourceName = 'invoices';
    Invoice.singularName = 'invoice';
    Invoice.pluralName = 'invoices';
    __decorate([
        Invoice.property({ type: Date }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "archived", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Number)
    ], Invoice.prototype, "id", void 0);
    __decorate([
        Invoice.property({ type: Date }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "creationDate", void 0);
    __decorate([
        Invoice.property({ type: Date }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "paymentDeadline", void 0);
    __decorate([
        Invoice.property({ type: Date }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "reminded", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", String)
    ], Invoice.prototype, "reminderMessage", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Boolean)
    ], Invoice.prototype, "forceReminders", void 0);
    __decorate([
        Invoice.property({ type: String }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "note", void 0);
    __decorate([
        Invoice.property({ type: Date }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "terms", void 0);
    __decorate([
        Invoice.property({ type: Number }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "subtotalCost", void 0);
    __decorate([
        Invoice.property({ type: Number }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "taxAmount", void 0);
    __decorate([
        Invoice.property({ type: Number }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "totalCost", void 0);
    __decorate([
        Invoice.property({ type: Boolean }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "sendSms", void 0);
    __decorate([
        Invoice.property({ type: Boolean }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "sendEmail", void 0);
    __decorate([
        Invoice.property({ type: Boolean }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "unpaid", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", String)
    ], Invoice.prototype, "currency", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Boolean)
    ], Invoice.prototype, "acceptStripe", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Boolean)
    ], Invoice.prototype, "acceptPaypal", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Boolean)
    ], Invoice.prototype, "acceptBankTransfer", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Boolean)
    ], Invoice.prototype, "acceptPhonePayment", void 0);
    __decorate([
        Invoice.property({ type: String }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "invoiceToken", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Boolean)
    ], Invoice.prototype, "isRemindable", void 0);
    __decorate([
        Invoice.property({ embeddedByDefault: false }),
        __metadata("design:type", Number)
    ], Invoice.prototype, "owedMoney", void 0);
    __decorate([
        Invoice.property({ embeddedByDefault: false }),
        __metadata("design:type", Number)
    ], Invoice.prototype, "paidMoney", void 0);
    __decorate([
        Invoice.property({ embeddedByDefault: false }),
        __metadata("design:type", Boolean)
    ], Invoice.prototype, "isCompletelyPaid", void 0);
    __decorate([
        Invoice.property({ type: User }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "responsibleManager", void 0);
    __decorate([
        Invoice.property({ type: User }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "creator", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", User)
    ], Invoice.prototype, "client", void 0);
    __decorate([
        Invoice.property({ type: Company }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "clientCompany", void 0);
    __decorate([
        Company.property({ arrayType: 'Company' }),
        __metadata("design:type", Array)
    ], Invoice.prototype, "subscriptionCompanies", void 0);
    __decorate([
        Invoice.property({ type: Address }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "shipping", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Domain)
    ], Invoice.prototype, "domain", void 0);
    __decorate([
        Invoice.property({ arrayType: 'Item' }),
        __metadata("design:type", Array)
    ], Invoice.prototype, "items", void 0);
    __decorate([
        Invoice.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "pdf", void 0);
    __decorate([
        Invoice.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "receipt", void 0);
    __decorate([
        Invoice.property({ type: PhoneNumber }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "clientPhone", void 0);
    __decorate([
        Invoice.property({ type: EmailAddress }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "clientEmail", void 0);
    __decorate([
        Invoice.property({ type: PhoneNumber }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "clientCompanyPhone", void 0);
    __decorate([
        Invoice.property({ type: EmailAddress }),
        __metadata("design:type", Object)
    ], Invoice.prototype, "clientCompanyEmail", void 0);
    __decorate([
        Invoice.property({ arrayType: 'DomainTag' }),
        __metadata("design:type", Array)
    ], Invoice.prototype, "tags", void 0);
    __decorate([
        Invoice.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], Invoice.prototype, "shipments", void 0);
    __decorate([
        Invoice.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], Invoice.prototype, "notifications", void 0);
    __decorate([
        Invoice.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], Invoice.prototype, "jobs", void 0);
    __decorate([
        Invoice.property(),
        __metadata("design:type", Cart)
    ], Invoice.prototype, "cart", void 0);
    __decorate([
        Invoice.property({ arrayType: 'Payment' }),
        __metadata("design:type", Array)
    ], Invoice.prototype, "payments", void 0);
    return Invoice;
}(Entity));
export { Invoice };
