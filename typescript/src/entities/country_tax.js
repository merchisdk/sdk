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
var CountryTax = /** @class */ (function (_super) {
    __extends(CountryTax, _super);
    function CountryTax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CountryTax.getNoTax = function () {
        var result = new this.merchi.CountryTax();
        result.id = 3; // 3 is a reserved id for 'no tax' by the backend
        result.taxName = 'No tax';
        result.taxPercent = 0;
        return result;
    };
    CountryTax.resourceName = 'country_taxes';
    CountryTax.singularName = 'countryTax';
    CountryTax.pluralName = 'countryTaxes';
    __decorate([
        CountryTax.property({ type: Date }),
        __metadata("design:type", Object)
    ], CountryTax.prototype, "archived", void 0);
    __decorate([
        CountryTax.property(),
        __metadata("design:type", Number)
    ], CountryTax.prototype, "id", void 0);
    __decorate([
        CountryTax.property({ type: String }),
        __metadata("design:type", Object)
    ], CountryTax.prototype, "country", void 0);
    __decorate([
        CountryTax.property(),
        __metadata("design:type", String)
    ], CountryTax.prototype, "taxName", void 0);
    __decorate([
        CountryTax.property({ type: Number }),
        __metadata("design:type", Object)
    ], CountryTax.prototype, "taxPercent", void 0);
    __decorate([
        CountryTax.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], CountryTax.prototype, "shipments", void 0);
    __decorate([
        CountryTax.property({ arrayType: 'Company' }),
        __metadata("design:type", Array)
    ], CountryTax.prototype, "companies", void 0);
    __decorate([
        CountryTax.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], CountryTax.prototype, "jobs", void 0);
    __decorate([
        CountryTax.property({ arrayType: 'Item' }),
        __metadata("design:type", Array)
    ], CountryTax.prototype, "items", void 0);
    return CountryTax;
}(Entity));
export { CountryTax };
