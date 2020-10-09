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
import { User } from './user';
var ShortUrl = /** @class */ (function (_super) {
    __extends(ShortUrl, _super);
    function ShortUrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShortUrl.resourceName = 'short_urls';
    ShortUrl.singularName = 'shortUrl';
    ShortUrl.pluralName = 'shortUrls';
    __decorate([
        ShortUrl.property({ type: Date }),
        __metadata("design:type", Object)
    ], ShortUrl.prototype, "archived", void 0);
    __decorate([
        ShortUrl.property(),
        __metadata("design:type", Number)
    ], ShortUrl.prototype, "id", void 0);
    __decorate([
        ShortUrl.property(),
        __metadata("design:type", String)
    ], ShortUrl.prototype, "prefixToken", void 0);
    __decorate([
        ShortUrl.property(),
        __metadata("design:type", String)
    ], ShortUrl.prototype, "suffixToken", void 0);
    __decorate([
        ShortUrl.property(),
        __metadata("design:type", String)
    ], ShortUrl.prototype, "originalLink", void 0);
    __decorate([
        ShortUrl.property(),
        __metadata("design:type", Number)
    ], ShortUrl.prototype, "triedTimes", void 0);
    __decorate([
        ShortUrl.property({ type: Date }),
        __metadata("design:type", Object)
    ], ShortUrl.prototype, "lastLookup", void 0);
    __decorate([
        ShortUrl.property({ type: User }),
        __metadata("design:type", Object)
    ], ShortUrl.prototype, "user", void 0);
    __decorate([
        ShortUrl.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], ShortUrl.prototype, "notification", void 0);
    return ShortUrl;
}(Entity));
export { ShortUrl };
