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
import { Invoice } from './invoice';
import { User } from './user';
var Payment = /** @class */ (function (_super) {
    __extends(Payment, _super);
    function Payment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Payment.resourceName = 'payments';
    Payment.singularName = 'payment';
    Payment.pluralName = 'payments';
    __decorate([
        Payment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Payment.prototype, "archived", void 0);
    __decorate([
        Payment.property(),
        __metadata("design:type", Number)
    ], Payment.prototype, "id", void 0);
    __decorate([
        Payment.property(),
        __metadata("design:type", Date)
    ], Payment.prototype, "payDate", void 0);
    __decorate([
        Payment.property(),
        __metadata("design:type", Number)
    ], Payment.prototype, "paymentType", void 0);
    __decorate([
        Payment.property(),
        __metadata("design:type", String)
    ], Payment.prototype, "note", void 0);
    __decorate([
        Payment.property(),
        __metadata("design:type", Number)
    ], Payment.prototype, "amount", void 0);
    __decorate([
        Payment.property(),
        __metadata("design:type", Boolean)
    ], Payment.prototype, "sendSms", void 0);
    __decorate([
        Payment.property(),
        __metadata("design:type", Boolean)
    ], Payment.prototype, "sendEmail", void 0);
    __decorate([
        Payment.property({ type: Invoice }),
        __metadata("design:type", Object)
    ], Payment.prototype, "invoice", void 0);
    __decorate([
        Payment.property({ type: User }),
        __metadata("design:type", Object)
    ], Payment.prototype, "paymentRecorder", void 0);
    return Payment;
}(Entity));
export { Payment };
