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
import { Domain } from './domain';
import { Entity } from '../entity';
var Category = /** @class */ (function (_super) {
    __extends(Category, _super);
    function Category() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Category.resourceName = 'categories';
    Category.singularName = 'category';
    Category.pluralName = 'categories';
    __decorate([
        Category.property({ type: Date }),
        __metadata("design:type", Object)
    ], Category.prototype, "archived", void 0);
    __decorate([
        Category.property(),
        __metadata("design:type", Number)
    ], Category.prototype, "id", void 0);
    __decorate([
        Category.property(),
        __metadata("design:type", String)
    ], Category.prototype, "name", void 0);
    __decorate([
        Category.property(),
        __metadata("design:type", Boolean)
    ], Category.prototype, "showDashboard", void 0);
    __decorate([
        Category.property(),
        __metadata("design:type", Boolean)
    ], Category.prototype, "showPublic", void 0);
    __decorate([
        Category.property(),
        __metadata("design:type", Domain)
    ], Category.prototype, "domain", void 0);
    __decorate([
        Category.property({ arrayType: 'Product' }),
        __metadata("design:type", Array)
    ], Category.prototype, "products", void 0);
    __decorate([
        Category.property({ arrayType: 'User' }),
        __metadata("design:type", Array)
    ], Category.prototype, "users", void 0);
    return Category;
}(Entity));
export { Category };
