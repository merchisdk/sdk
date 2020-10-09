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
import { CartItem } from './cart_item';
import { Entity } from '../entity';
import { Job } from './job';
import { VariationField } from './variation_field';
import { VariationsGroup } from './variations_group';
var Variation = /** @class */ (function (_super) {
    __extends(Variation, _super);
    function Variation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Variation.resourceName = 'variations';
    Variation.singularName = 'variation';
    Variation.pluralName = 'variations';
    __decorate([
        Variation.property({ type: Date }),
        __metadata("design:type", Object)
    ], Variation.prototype, "archived", void 0);
    __decorate([
        Variation.property(),
        __metadata("design:type", Number)
    ], Variation.prototype, "id", void 0);
    __decorate([
        Variation.property({ type: String }),
        __metadata("design:type", Object)
    ], Variation.prototype, "value", void 0);
    __decorate([
        Variation.property(),
        __metadata("design:type", String)
    ], Variation.prototype, "currency", void 0);
    __decorate([
        Variation.property(),
        __metadata("design:type", Number)
    ], Variation.prototype, "cost", void 0);
    __decorate([
        Variation.property(),
        __metadata("design:type", Number)
    ], Variation.prototype, "quantity", void 0);
    __decorate([
        Variation.property(),
        __metadata("design:type", Number)
    ], Variation.prototype, "onceOffCost", void 0);
    __decorate([
        Variation.property(),
        __metadata("design:type", Number)
    ], Variation.prototype, "unitCost", void 0);
    __decorate([
        Variation.property(),
        __metadata("design:type", Number)
    ], Variation.prototype, "unitCostTotal", void 0);
    __decorate([
        Variation.property(),
        __metadata("design:type", VariationField)
    ], Variation.prototype, "variationField", void 0);
    __decorate([
        Variation.property({ type: VariationsGroup }),
        __metadata("design:type", Object)
    ], Variation.prototype, "variationsGroup", void 0);
    __decorate([
        Variation.property({ type: Job }),
        __metadata("design:type", Object)
    ], Variation.prototype, "job", void 0);
    __decorate([
        Variation.property({ type: CartItem }),
        __metadata("design:type", Object)
    ], Variation.prototype, "cartItem", void 0);
    __decorate([
        Variation.property({ arrayType: 'MerchiFile' }),
        __metadata("design:type", Array)
    ], Variation.prototype, "variationFiles", void 0);
    __decorate([
        Variation.property({ arrayType: 'VariationFieldsOption' }),
        __metadata("design:type", Array)
    ], Variation.prototype, "selectedOptions", void 0);
    return Variation;
}(Entity));
export { Variation };
