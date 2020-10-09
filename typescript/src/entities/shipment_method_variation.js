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
import { ShipmentMethod } from './shipment_method';
var ShipmentMethodVariation = /** @class */ (function (_super) {
    __extends(ShipmentMethodVariation, _super);
    function ShipmentMethodVariation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShipmentMethodVariation.resourceName = 'shipment_method_variations';
    ShipmentMethodVariation.singularName = 'shipmentMethodVariation';
    ShipmentMethodVariation.pluralName = 'shipmentMethodVariations';
    __decorate([
        ShipmentMethodVariation.property(),
        __metadata("design:type", Number)
    ], ShipmentMethodVariation.prototype, "id", void 0);
    __decorate([
        ShipmentMethodVariation.property({ type: String }),
        __metadata("design:type", Object)
    ], ShipmentMethodVariation.prototype, "destinationCountry", void 0);
    __decorate([
        ShipmentMethodVariation.property({ type: String }),
        __metadata("design:type", Object)
    ], ShipmentMethodVariation.prototype, "destinationState", void 0);
    __decorate([
        ShipmentMethodVariation.property({ type: Number }),
        __metadata("design:type", Object)
    ], ShipmentMethodVariation.prototype, "cost", void 0);
    __decorate([
        ShipmentMethodVariation.property(),
        __metadata("design:type", String)
    ], ShipmentMethodVariation.prototype, "currency", void 0);
    __decorate([
        ShipmentMethodVariation.property({ type: Number }),
        __metadata("design:type", Object)
    ], ShipmentMethodVariation.prototype, "maxWeight", void 0);
    __decorate([
        ShipmentMethodVariation.property({ type: 'CountryTax' }),
        __metadata("design:type", Object)
    ], ShipmentMethodVariation.prototype, "taxType", void 0);
    __decorate([
        ShipmentMethodVariation.property(),
        __metadata("design:type", ShipmentMethod)
    ], ShipmentMethodVariation.prototype, "shipmentMethod", void 0);
    return ShipmentMethodVariation;
}(Entity));
export { ShipmentMethodVariation };
