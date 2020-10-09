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
import { Menu } from './menu';
var MenuItem = /** @class */ (function (_super) {
    __extends(MenuItem, _super);
    function MenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuItem.resourceName = 'menu_items';
    MenuItem.singularName = 'menuItem';
    MenuItem.pluralName = 'menuItems';
    __decorate([
        MenuItem.property({ type: Date }),
        __metadata("design:type", Object)
    ], MenuItem.prototype, "archived", void 0);
    __decorate([
        MenuItem.property(),
        __metadata("design:type", Number)
    ], MenuItem.prototype, "id", void 0);
    __decorate([
        MenuItem.property(),
        __metadata("design:type", String)
    ], MenuItem.prototype, "name", void 0);
    __decorate([
        MenuItem.property(),
        __metadata("design:type", Number)
    ], MenuItem.prototype, "linkType", void 0);
    __decorate([
        MenuItem.property(),
        __metadata("design:type", String)
    ], MenuItem.prototype, "linkUri", void 0);
    __decorate([
        MenuItem.property(),
        __metadata("design:type", Number)
    ], MenuItem.prototype, "position", void 0);
    __decorate([
        MenuItem.property(),
        __metadata("design:type", Menu)
    ], MenuItem.prototype, "menu", void 0);
    return MenuItem;
}(Entity));
export { MenuItem };
