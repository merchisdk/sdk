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
import { Cart } from './cart';
import { CountryTax } from './country_tax';
import { Entity } from '../entity';
import { Product } from './product';
var CartItem = /** @class */ (function (_super) {
    __extends(CartItem, _super);
    function CartItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.requiresShipment = function () {
            if (_this.product === undefined) {
                throw 'product is undefined, did you forget to embed it?';
            }
            if (_this.product.needsShipping === undefined) {
                throw 'needsShipping is undefined, did you forget to embed it?';
            }
            return _this.product.needsShipping;
        };
        return _this;
    }
    CartItem.resourceName = 'cart_items';
    CartItem.singularName = 'cartItem';
    CartItem.pluralName = 'cartItems';
    __decorate([
        CartItem.property({ type: Date }),
        __metadata("design:type", Object)
    ], CartItem.prototype, "archived", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Number)
    ], CartItem.prototype, "id", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Number)
    ], CartItem.prototype, "quantity", void 0);
    __decorate([
        CartItem.property({ type: String }),
        __metadata("design:type", Object)
    ], CartItem.prototype, "notes", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Date)
    ], CartItem.prototype, "creationDate", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Number)
    ], CartItem.prototype, "currency", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Number)
    ], CartItem.prototype, "subtotalCost", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Number)
    ], CartItem.prototype, "taxAmount", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Number)
    ], CartItem.prototype, "totalCost", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Product)
    ], CartItem.prototype, "product", void 0);
    __decorate([
        CartItem.property(),
        __metadata("design:type", Cart)
    ], CartItem.prototype, "cart", void 0);
    __decorate([
        CartItem.property({ embeddedByDefault: false }),
        __metadata("design:type", CountryTax)
    ], CartItem.prototype, "taxType", void 0);
    __decorate([
        CartItem.property({ arrayType: 'VariationsGroup' }),
        __metadata("design:type", Array)
    ], CartItem.prototype, "variationsGroups", void 0);
    __decorate([
        CartItem.property({ arrayType: 'Variation' }),
        __metadata("design:type", Array)
    ], CartItem.prototype, "variations", void 0);
    return CartItem;
}(Entity));
export { CartItem };
