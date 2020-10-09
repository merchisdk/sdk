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
var BidItem = /** @class */ (function (_super) {
    __extends(BidItem, _super);
    function BidItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.total = function () {
            var quant = _this.quantity ? _this.quantity : 0;
            var unitPrice = _this.unitPrice ? _this.unitPrice : 0;
            return (quant * unitPrice).toFixed(3);
        };
        return _this;
    }
    BidItem.resourceName = 'bid_items';
    BidItem.singularName = 'bidItem';
    BidItem.pluralName = 'bidItems';
    __decorate([
        BidItem.property({ type: Date }),
        __metadata("design:type", Object)
    ], BidItem.prototype, "archived", void 0);
    __decorate([
        BidItem.property(),
        __metadata("design:type", Number)
    ], BidItem.prototype, "id", void 0);
    __decorate([
        BidItem.property(),
        __metadata("design:type", Number)
    ], BidItem.prototype, "type", void 0);
    __decorate([
        BidItem.property(),
        __metadata("design:type", Number)
    ], BidItem.prototype, "quantity", void 0);
    __decorate([
        BidItem.property({ type: String }),
        __metadata("design:type", Object)
    ], BidItem.prototype, "description", void 0);
    __decorate([
        BidItem.property({ type: Number }),
        __metadata("design:type", Object)
    ], BidItem.prototype, "unitPrice", void 0);
    __decorate([
        BidItem.property(),
        __metadata("design:type", Bid)
    ], BidItem.prototype, "bid", void 0);
    return BidItem;
}(Entity));
export { BidItem };
