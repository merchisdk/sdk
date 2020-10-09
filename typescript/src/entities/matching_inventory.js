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
import { Job } from './job';
import { Inventory } from './inventory';
import { InventoryStatus } from '../constants/inventory_statuses';
var MatchingInventory = /** @class */ (function (_super) {
    __extends(MatchingInventory, _super);
    function MatchingInventory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatchingInventory.resourceName = 'matching_inventories';
    MatchingInventory.singularName = 'matchingInventory';
    MatchingInventory.pluralName = 'matchingInventories';
    __decorate([
        MatchingInventory.property({ type: Date }),
        __metadata("design:type", Object)
    ], MatchingInventory.prototype, "archived", void 0);
    __decorate([
        MatchingInventory.property({ type: Date }),
        __metadata("design:type", Object)
    ], MatchingInventory.prototype, "deductionDate", void 0);
    __decorate([
        MatchingInventory.property(),
        __metadata("design:type", Job)
    ], MatchingInventory.prototype, "job", void 0);
    __decorate([
        MatchingInventory.property({ type: 'VariationsGroup' }),
        __metadata("design:type", Object)
    ], MatchingInventory.prototype, "group", void 0);
    __decorate([
        MatchingInventory.property({ type: Inventory }),
        __metadata("design:type", Object)
    ], MatchingInventory.prototype, "inventory", void 0);
    __decorate([
        MatchingInventory.property(),
        __metadata("design:type", Number)
    ], MatchingInventory.prototype, "status", void 0);
    return MatchingInventory;
}(Entity));
export { MatchingInventory };
