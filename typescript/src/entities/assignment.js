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
import { Bid } from './bid';
import { Entity } from '../entity';
import { Shipment } from './shipment';
import { SupplyDomain } from './supply_domain';
import { User } from './user';
var Assignment = /** @class */ (function (_super) {
    __extends(Assignment, _super);
    function Assignment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Assignment.resourceName = 'assignments';
    Assignment.singularName = 'assignment';
    Assignment.pluralName = 'assignments';
    __decorate([
        Assignment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "archived", void 0);
    __decorate([
        Assignment.property(),
        __metadata("design:type", Number)
    ], Assignment.prototype, "id", void 0);
    __decorate([
        Assignment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "managerAccepts", void 0);
    __decorate([
        Assignment.property({ type: Date }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "supplierRefused", void 0);
    __decorate([
        Assignment.property(),
        __metadata("design:type", Date)
    ], Assignment.prototype, "productionDeadline", void 0);
    __decorate([
        Assignment.property(),
        __metadata("design:type", Date)
    ], Assignment.prototype, "assignmentDeadline", void 0);
    __decorate([
        Assignment.property({ type: 'Job' }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "job", void 0);
    __decorate([
        Assignment.property({ type: 'Job' }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "supplyJob", void 0);
    __decorate([
        Assignment.property({ type: User }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "supplier", void 0);
    __decorate([
        Assignment.property({ type: Bid }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "bid", void 0);
    __decorate([
        Assignment.property({ arrayType: 'ProductionComment' }),
        __metadata("design:type", Array)
    ], Assignment.prototype, "comments", void 0);
    __decorate([
        Assignment.property({ type: Shipment }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "shipment", void 0);
    __decorate([
        Assignment.property({ type: SupplyDomain }),
        __metadata("design:type", Object)
    ], Assignment.prototype, "supplyDomain", void 0);
    __decorate([
        Assignment.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], Assignment.prototype, "notifications", void 0);
    return Assignment;
}(Entity));
export { Assignment };
