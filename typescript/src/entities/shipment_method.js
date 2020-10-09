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
import { Address } from './address';
import { Company } from './company';
import { CountryTax } from './country_tax';
var ShipmentMethod = /** @class */ (function (_super) {
    __extends(ShipmentMethod, _super);
    function ShipmentMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShipmentMethod.resourceName = 'shipment_methods';
    ShipmentMethod.singularName = 'shipmentMethod';
    ShipmentMethod.pluralName = 'shipmentMethods';
    __decorate([
        ShipmentMethod.property(),
        __metadata("design:type", Number)
    ], ShipmentMethod.prototype, "id", void 0);
    __decorate([
        ShipmentMethod.property(),
        __metadata("design:type", String)
    ], ShipmentMethod.prototype, "name", void 0);
    __decorate([
        ShipmentMethod.property({ type: Address }),
        __metadata("design:type", Object)
    ], ShipmentMethod.prototype, "originAddress", void 0);
    __decorate([
        ShipmentMethod.property({ type: Company }),
        __metadata("design:type", Object)
    ], ShipmentMethod.prototype, "company", void 0);
    __decorate([
        ShipmentMethod.property({ type: Number }),
        __metadata("design:type", Object)
    ], ShipmentMethod.prototype, "defaultCost", void 0);
    __decorate([
        ShipmentMethod.property({ type: Number }),
        __metadata("design:type", Object)
    ], ShipmentMethod.prototype, "maxCost", void 0);
    __decorate([
        ShipmentMethod.property({ type: Number }),
        __metadata("design:type", Object)
    ], ShipmentMethod.prototype, "transportCompany", void 0);
    __decorate([
        ShipmentMethod.property(),
        __metadata("design:type", String)
    ], ShipmentMethod.prototype, "currency", void 0);
    __decorate([
        ShipmentMethod.property({ type: CountryTax }),
        __metadata("design:type", Object)
    ], ShipmentMethod.prototype, "taxType", void 0);
    __decorate([
        ShipmentMethod.property({ arrayType: 'ShipmentMethodVariation' }),
        __metadata("design:type", Array)
    ], ShipmentMethod.prototype, "variations", void 0);
    return ShipmentMethod;
}(Entity));
export { ShipmentMethod };
