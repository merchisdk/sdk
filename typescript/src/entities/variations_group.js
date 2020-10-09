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
import { MatchingInventory } from './matching_inventory';
var VariationsGroup = /** @class */ (function (_super) {
    __extends(VariationsGroup, _super);
    function VariationsGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VariationsGroup.resourceName = 'variations_groups';
    VariationsGroup.singularName = 'variationsGroup';
    VariationsGroup.pluralName = 'variationsGroups';
    __decorate([
        VariationsGroup.property({ type: Date }),
        __metadata("design:type", Object)
    ], VariationsGroup.prototype, "archived", void 0);
    __decorate([
        VariationsGroup.property(),
        __metadata("design:type", Number)
    ], VariationsGroup.prototype, "id", void 0);
    __decorate([
        VariationsGroup.property(),
        __metadata("design:type", Number)
    ], VariationsGroup.prototype, "quantity", void 0);
    __decorate([
        VariationsGroup.property({ type: Number }),
        __metadata("design:type", Object)
    ], VariationsGroup.prototype, "groupCost", void 0);
    __decorate([
        VariationsGroup.property({ type: Job }),
        __metadata("design:type", Object)
    ], VariationsGroup.prototype, "job", void 0);
    __decorate([
        VariationsGroup.property({ type: CartItem }),
        __metadata("design:type", Object)
    ], VariationsGroup.prototype, "cartItem", void 0);
    __decorate([
        VariationsGroup.property({ type: MatchingInventory }),
        __metadata("design:type", Object)
    ], VariationsGroup.prototype, "matchingInventory", void 0);
    __decorate([
        VariationsGroup.property({ arrayType: 'Variation' }),
        __metadata("design:type", Array)
    ], VariationsGroup.prototype, "variations", void 0);
    return VariationsGroup;
}(Entity));
export { VariationsGroup };
