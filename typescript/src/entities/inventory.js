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
import { Entity } from '../entity';
import { Product } from './product';
var Inventory = /** @class */ (function (_super) {
    __extends(Inventory, _super);
    function Inventory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Inventory.resourceName = 'inventories';
    Inventory.singularName = 'inventory';
    Inventory.pluralName = 'inventories';
    __decorate([
        Inventory.property({ type: Date }),
        __metadata("design:type", Object)
    ], Inventory.prototype, "archived", void 0);
    __decorate([
        Inventory.property(),
        __metadata("design:type", Number)
    ], Inventory.prototype, "id", void 0);
    __decorate([
        Inventory.property(),
        __metadata("design:type", Number)
    ], Inventory.prototype, "quantity", void 0);
    __decorate([
        Inventory.property(),
        __metadata("design:type", String)
    ], Inventory.prototype, "name", void 0);
    __decorate([
        Inventory.property(),
        __metadata("design:type", String)
    ], Inventory.prototype, "notes", void 0);
    __decorate([
        Inventory.property(),
        __metadata("design:type", Product)
    ], Inventory.prototype, "product", void 0);
    __decorate([
        Inventory.property({ type: Address }),
        __metadata("design:type", Object)
    ], Inventory.prototype, "address", void 0);
    __decorate([
        Inventory.property({ arrayType: 'VariationsGroup' }),
        __metadata("design:type", Array)
    ], Inventory.prototype, "variationsGroups", void 0);
    __decorate([
        Inventory.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], Inventory.prototype, "jobs", void 0);
    __decorate([
        Inventory.property({ arrayType: 'InventoryUnitVariation' }),
        __metadata("design:type", Array)
    ], Inventory.prototype, "inventoryUnitVariations", void 0);
    return Inventory;
}(Entity));
export { Inventory };
