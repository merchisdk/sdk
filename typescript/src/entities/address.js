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
var Address = /** @class */ (function (_super) {
    __extends(Address, _super);
    function Address() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Address.resourceName = 'addresses';
    Address.singularName = 'address';
    Address.pluralName = 'addresses';
    __decorate([
        Address.property({ type: Date }),
        __metadata("design:type", Object)
    ], Address.prototype, "archived", void 0);
    __decorate([
        Address.property(),
        __metadata("design:type", Number)
    ], Address.prototype, "id", void 0);
    __decorate([
        Address.property({ type: String }),
        __metadata("design:type", Object)
    ], Address.prototype, "lineOne", void 0);
    __decorate([
        Address.property({ type: String }),
        __metadata("design:type", Object)
    ], Address.prototype, "lineTwo", void 0);
    __decorate([
        Address.property({ type: String }),
        __metadata("design:type", Object)
    ], Address.prototype, "city", void 0);
    __decorate([
        Address.property({ type: String }),
        __metadata("design:type", Object)
    ], Address.prototype, "state", void 0);
    __decorate([
        Address.property({ type: String }),
        __metadata("design:type", Object)
    ], Address.prototype, "country", void 0);
    __decorate([
        Address.property({ type: String }),
        __metadata("design:type", Object)
    ], Address.prototype, "postcode", void 0);
    __decorate([
        Address.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], Address.prototype, "shipmentAsSenderAddress", void 0);
    __decorate([
        Address.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], Address.prototype, "shipmentsAsReceiverAddress", void 0);
    __decorate([
        Address.property({ arrayType: 'Bank' }),
        __metadata("design:type", Array)
    ], Address.prototype, "banks", void 0);
    __decorate([
        Address.property({ arrayType: 'User' }),
        __metadata("design:type", Array)
    ], Address.prototype, "users", void 0);
    __decorate([
        Address.property({ arrayType: 'Inventory' }),
        __metadata("design:type", Array)
    ], Address.prototype, "inventories", void 0);
    __decorate([
        Address.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], Address.prototype, "jobs", void 0);
    __decorate([
        Address.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], Address.prototype, "productedJobs", void 0);
    __decorate([
        Address.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], Address.prototype, "shippingTo", void 0);
    __decorate([
        Address.property({ arrayType: 'Company' }),
        __metadata("design:type", Array)
    ], Address.prototype, "companies", void 0);
    return Address;
}(Entity));
export { Address };
