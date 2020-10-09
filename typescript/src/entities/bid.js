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
import { kahanSum } from '../util/float';
var Bid = /** @class */ (function (_super) {
    __extends(Bid, _super);
    function Bid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.quoteTotal = function () {
            if (_this.bidItems === undefined) {
                throw new Error('bidItems is undefined, did you forget to embed it?');
            }
            function getTotal(bidItem) {
                return parseFloat(bidItem.total());
            }
            return kahanSum(_this.bidItems.map(getTotal)).toFixed(3);
        };
        _this.findBidItemIndex = function (bidItemId) {
            if (_this.bidItems === undefined) {
                throw new Error('bidItems is undefined, did you forget to embed it?');
            }
            function checkEqualId(bidItem) {
                return bidItem.id === bidItemId;
            }
            return _this.bidItems.findIndex(checkEqualId);
        };
        _this.removeBidItem = function (bidItem) {
            if (_this.bidItems === undefined) {
                throw new Error('bidItems is undefined, did you forget to embed it?');
            }
            if (bidItem.id === undefined) {
                throw new Error('bidItem.id is undefined, did you forget to embed it?');
            }
            var index = _this.findBidItemIndex(bidItem.id);
            if (index > -1) {
                _this.bidItems.splice(index, 1);
            }
        };
        _this.deadlineTimeDifference = function () {
            if (_this.agreedDeadline === undefined) {
                var err = 'agreedDeadline is undefined, did you forget to embed it?';
                throw new Error(err);
            }
            if (_this.assignments === undefined) {
                var err = 'assignments is undefiend, did you forget to embed it?';
                throw new Error(err);
            }
            if (_this.assignments.length < 1) {
                return null;
            }
            if (_this.agreedDeadline === null) {
                return null;
            }
            var assignment = _this.assignments[0];
            if (assignment.productionDeadline === undefined) {
                var err = 'productionDeadline is undefined, did you forget to embed' +
                    'it?';
                throw new Error(err);
            }
            var productionDeadline = assignment.productionDeadline;
            return productionDeadline.valueOf() - _this.agreedDeadline.valueOf();
        };
        return _this;
    }
    Bid.resourceName = 'bids';
    Bid.singularName = 'bid';
    Bid.pluralName = 'bids';
    __decorate([
        Bid.property({ type: Date }),
        __metadata("design:type", Object)
    ], Bid.prototype, "archived", void 0);
    __decorate([
        Bid.property(),
        __metadata("design:type", Number)
    ], Bid.prototype, "id", void 0);
    __decorate([
        Bid.property({ type: Date }),
        __metadata("design:type", Object)
    ], Bid.prototype, "agreedDeadline", void 0);
    __decorate([
        Bid.property({ arrayType: 'BidItem' }),
        __metadata("design:type", Array)
    ], Bid.prototype, "bidItems", void 0);
    __decorate([
        Bid.property({ arrayType: 'Assignment' }),
        __metadata("design:type", Array)
    ], Bid.prototype, "assignments", void 0);
    return Bid;
}(Entity));
export { Bid };
