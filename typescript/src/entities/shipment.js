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
import { Company } from './company';
import { CountryTax } from './country_tax';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { User } from './user';
import { ShipmentMethod } from './shipment_method';
var Shipment = /** @class */ (function (_super) {
    __extends(Shipment, _super);
    function Shipment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Shipment.resourceName = 'shipments';
    Shipment.singularName = 'shipment';
    Shipment.pluralName = 'shipments';
    __decorate([
        Shipment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "archived", void 0);
    __decorate([
        Shipment.property(),
        __metadata("design:type", Number)
    ], Shipment.prototype, "id", void 0);
    __decorate([
        Shipment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "creationDate", void 0);
    __decorate([
        Shipment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "dispatchedDate", void 0);
    __decorate([
        Shipment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "dispatchDate", void 0);
    __decorate([
        Shipment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "expectedReceiveDate", void 0);
    __decorate([
        Shipment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "receivedDate", void 0);
    __decorate([
        Shipment.property(),
        __metadata("design:type", Boolean)
    ], Shipment.prototype, "senderResponsible", void 0);
    __decorate([
        Shipment.property({ type: String }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "senderNotes", void 0);
    __decorate([
        Shipment.property({ type: String }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "receiverNotes", void 0);
    __decorate([
        Shipment.property({ type: Number }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "transportCompany", void 0);
    __decorate([
        Shipment.property({ type: String }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "trackingNumber", void 0);
    __decorate([
        Shipment.property({ type: Number }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "cost", void 0);
    __decorate([
        Shipment.property({ type: Number }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "taxAmount", void 0);
    __decorate([
        Shipment.property({ type: Number }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "maxWeight", void 0);
    __decorate([
        Shipment.property({ type: Number }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "maxVolume", void 0);
    __decorate([
        Shipment.property(),
        __metadata("design:type", Boolean)
    ], Shipment.prototype, "sendSms", void 0);
    __decorate([
        Shipment.property(),
        __metadata("design:type", Boolean)
    ], Shipment.prototype, "sendEmail", void 0);
    __decorate([
        Shipment.property({ type: CountryTax }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "taxType", void 0);
    __decorate([
        Shipment.property({ type: User }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "sender", void 0);
    __decorate([
        Shipment.property({ type: Company }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "senderCompany", void 0);
    __decorate([
        Shipment.property({ type: Address }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "senderAddress", void 0);
    __decorate([
        Shipment.property({ type: User }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "receiver", void 0);
    __decorate([
        Shipment.property({ type: Company }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "receiverCompany", void 0);
    __decorate([
        Shipment.property({ type: Address }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "receiverAddress", void 0);
    __decorate([
        Shipment.property({ type: Invoice }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "invoice", void 0);
    __decorate([
        Shipment.property({ type: ShipmentMethod }),
        __metadata("design:type", Object)
    ], Shipment.prototype, "shipmentMethod", void 0);
    __decorate([
        Shipment.property({ arrayType: 'DomainTag' }),
        __metadata("design:type", Array)
    ], Shipment.prototype, "tags", void 0);
    __decorate([
        Shipment.property({ arrayType: 'Assignment' }),
        __metadata("design:type", Array)
    ], Shipment.prototype, "assignments", void 0);
    __decorate([
        Shipment.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], Shipment.prototype, "jobs", void 0);
    return Shipment;
}(Entity));
export { Shipment };
