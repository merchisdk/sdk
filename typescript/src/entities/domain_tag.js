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
var DomainTag = /** @class */ (function (_super) {
    __extends(DomainTag, _super);
    function DomainTag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DomainTag.resourceName = 'domain_tags';
    DomainTag.singularName = 'domainTag';
    DomainTag.pluralName = 'domainTags';
    __decorate([
        DomainTag.property(),
        __metadata("design:type", Number)
    ], DomainTag.prototype, "id", void 0);
    __decorate([
        DomainTag.property(),
        __metadata("design:type", Number)
    ], DomainTag.prototype, "colour", void 0);
    __decorate([
        DomainTag.property(),
        __metadata("design:type", String)
    ], DomainTag.prototype, "name", void 0);
    __decorate([
        DomainTag.property(),
        __metadata("design:type", String)
    ], DomainTag.prototype, "description", void 0);
    __decorate([
        DomainTag.property(),
        __metadata("design:type", Domain)
    ], DomainTag.prototype, "domain", void 0);
    __decorate([
        DomainTag.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], DomainTag.prototype, "jobs", void 0);
    __decorate([
        DomainTag.property({ arrayType: 'Product' }),
        __metadata("design:type", Array)
    ], DomainTag.prototype, "products", void 0);
    __decorate([
        DomainTag.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], DomainTag.prototype, "invoices", void 0);
    __decorate([
        DomainTag.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], DomainTag.prototype, "shipments", void 0);
    return DomainTag;
}(Entity));
export { DomainTag };
