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
var Bank = /** @class */ (function (_super) {
    __extends(Bank, _super);
    function Bank() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bank.resourceName = 'banks';
    Bank.singularName = 'bank';
    Bank.pluralName = 'banks';
    __decorate([
        Bank.property({ type: Date }),
        __metadata("design:type", Object)
    ], Bank.prototype, "archived", void 0);
    __decorate([
        Bank.property(),
        __metadata("design:type", Number)
    ], Bank.prototype, "id", void 0);
    __decorate([
        Bank.property(),
        __metadata("design:type", Boolean)
    ], Bank.prototype, "default", void 0);
    __decorate([
        Bank.property(),
        __metadata("design:type", String)
    ], Bank.prototype, "bankName", void 0);
    __decorate([
        Bank.property(),
        __metadata("design:type", String)
    ], Bank.prototype, "accountNumber", void 0);
    __decorate([
        Bank.property(),
        __metadata("design:type", String)
    ], Bank.prototype, "accountName", void 0);
    __decorate([
        Bank.property({ type: String }),
        __metadata("design:type", Object)
    ], Bank.prototype, "bsb", void 0);
    __decorate([
        Bank.property({ type: String }),
        __metadata("design:type", Object)
    ], Bank.prototype, "swiftCode", void 0);
    __decorate([
        Bank.property({ type: String }),
        __metadata("design:type", Object)
    ], Bank.prototype, "iban", void 0);
    __decorate([
        Bank.property({ type: String }),
        __metadata("design:type", Object)
    ], Bank.prototype, "bankCode", void 0);
    __decorate([
        Bank.property({ type: String }),
        __metadata("design:type", Object)
    ], Bank.prototype, "bankAddress", void 0);
    __decorate([
        Bank.property(),
        __metadata("design:type", Company)
    ], Bank.prototype, "company", void 0);
    return Bank;
}(Entity));
export { Bank };
