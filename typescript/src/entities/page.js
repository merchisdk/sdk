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
import { Theme } from './theme';
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Page.resourceName = 'pages';
    Page.singularName = 'page';
    Page.pluralName = 'themes';
    __decorate([
        Page.property(),
        __metadata("design:type", Number)
    ], Page.prototype, "id", void 0);
    __decorate([
        Page.property(),
        __metadata("design:type", String)
    ], Page.prototype, "name", void 0);
    __decorate([
        Page.property(),
        __metadata("design:type", String)
    ], Page.prototype, "slug", void 0);
    __decorate([
        Page.property(),
        __metadata("design:type", String)
    ], Page.prototype, "template", void 0);
    __decorate([
        Page.property(),
        __metadata("design:type", String)
    ], Page.prototype, "js", void 0);
    __decorate([
        Page.property(),
        __metadata("design:type", String)
    ], Page.prototype, "html", void 0);
    __decorate([
        Page.property({ type: String }),
        __metadata("design:type", Object)
    ], Page.prototype, "error", void 0);
    __decorate([
        Page.property({ type: 'Theme' }),
        __metadata("design:type", Theme)
    ], Page.prototype, "theme", void 0);
    return Page;
}(Entity));
export { Page };
