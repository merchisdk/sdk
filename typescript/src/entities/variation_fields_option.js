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
import { MerchiFile } from './file';
import { VariationField } from './variation_field';
var VariationFieldsOption = /** @class */ (function (_super) {
    __extends(VariationFieldsOption, _super);
    function VariationFieldsOption() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.totalCost = function (quantity) {
            if (_this.variationCost === undefined) {
                throw new Error('variationCost is unknown');
            }
            if (_this.variationUnitCost === undefined) {
                throw new Error('variationUnitCost is unknown');
            }
            return _this.variationCost + _this.variationUnitCost * quantity;
        };
        return _this;
    }
    VariationFieldsOption.resourceName = 'variation_fields_options';
    VariationFieldsOption.singularName = 'variationFieldsOption';
    VariationFieldsOption.pluralName = 'variationFieldsOptions';
    __decorate([
        VariationFieldsOption.property({ type: Date }),
        __metadata("design:type", Object)
    ], VariationFieldsOption.prototype, "archived", void 0);
    __decorate([
        VariationFieldsOption.property(),
        __metadata("design:type", Number)
    ], VariationFieldsOption.prototype, "id", void 0);
    __decorate([
        VariationFieldsOption.property({ type: String }),
        __metadata("design:type", Object)
    ], VariationFieldsOption.prototype, "value", void 0);
    __decorate([
        VariationFieldsOption.property({ type: String }),
        __metadata("design:type", Object)
    ], VariationFieldsOption.prototype, "colour", void 0);
    __decorate([
        VariationFieldsOption.property(),
        __metadata("design:type", String)
    ], VariationFieldsOption.prototype, "currency", void 0);
    __decorate([
        VariationFieldsOption.property(),
        __metadata("design:type", Boolean)
    ], VariationFieldsOption.prototype, "default", void 0);
    __decorate([
        VariationFieldsOption.property(),
        __metadata("design:type", Number)
    ], VariationFieldsOption.prototype, "position", void 0);
    __decorate([
        VariationFieldsOption.property(),
        __metadata("design:type", Number)
    ], VariationFieldsOption.prototype, "variationCost", void 0);
    __decorate([
        VariationFieldsOption.property(),
        __metadata("design:type", Number)
    ], VariationFieldsOption.prototype, "variationUnitCost", void 0);
    __decorate([
        VariationFieldsOption.property({ type: VariationField }),
        __metadata("design:type", Object)
    ], VariationFieldsOption.prototype, "variationField", void 0);
    __decorate([
        VariationFieldsOption.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], VariationFieldsOption.prototype, "linkedFile", void 0);
    __decorate([
        VariationFieldsOption.property({ arrayType: 'Variation' }),
        __metadata("design:type", Array)
    ], VariationFieldsOption.prototype, "selectedByVariations", void 0);
    __decorate([
        VariationFieldsOption.property({ arrayType: 'InventoryUnitVariation' }),
        __metadata("design:type", Array)
    ], VariationFieldsOption.prototype, "inventoryUnitVariations", void 0);
    return VariationFieldsOption;
}(Entity));
export { VariationFieldsOption };
