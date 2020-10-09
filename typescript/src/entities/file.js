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
var MerchiFile = /** @class */ (function (_super) {
    __extends(MerchiFile, _super);
    function MerchiFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fromFormFile = function (file) {
            _this.fileData = file;
            _this.mimetype = file.type || 'application/octet-stream';
            _this.name = file.name;
            _this.size = file.size;
        };
        _this.isImage = function () {
            if (_this.mimetype === undefined) {
                var err = 'mimetype is undefined, did you forget to embed it?';
                throw new Error(err);
            }
            if (_this.mimetype === null) {
                return false;
            }
            return _this.mimetype.split('/')[0] === 'image';
        };
        return _this;
    }
    MerchiFile.resourceName = 'files';
    MerchiFile.singularName = 'file';
    MerchiFile.pluralName = 'files';
    __decorate([
        MerchiFile.property({ type: Date }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "archived", void 0);
    __decorate([
        MerchiFile.property(),
        __metadata("design:type", Number)
    ], MerchiFile.prototype, "id", void 0);
    __decorate([
        MerchiFile.property(),
        __metadata("design:type", String)
    ], MerchiFile.prototype, "uploadId", void 0);
    __decorate([
        MerchiFile.property({ type: String }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "name", void 0);
    __decorate([
        MerchiFile.property({ type: String }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "mimetype", void 0);
    __decorate([
        MerchiFile.property(),
        __metadata("design:type", Number)
    ], MerchiFile.prototype, "size", void 0);
    __decorate([
        MerchiFile.property({ type: Date }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "creationDate", void 0);
    __decorate([
        MerchiFile.property({ type: String }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "cachedViewUrl", void 0);
    __decorate([
        MerchiFile.property({ type: Date }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "viewUrlExpires", void 0);
    __decorate([
        MerchiFile.property({ type: String }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "cachedDownloadUrl", void 0);
    __decorate([
        MerchiFile.property({ type: Date }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "downloadUrlExpires", void 0);
    __decorate([
        MerchiFile.property({ type: User }),
        __metadata("design:type", Object)
    ], MerchiFile.prototype, "uploader", void 0);
    __decorate([
        MerchiFile.property(),
        __metadata("design:type", String)
    ], MerchiFile.prototype, "viewUrl", void 0);
    __decorate([
        MerchiFile.property(),
        __metadata("design:type", String)
    ], MerchiFile.prototype, "downloadUrl", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Component' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "components", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Component' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "componentFeatureImages", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'DraftComment' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "draftComments", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Variation' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "variations", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Backup' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "backups", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "notification", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Company' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "companyLogos", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Product' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "products", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Product' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "featuredProducts", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Draft' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "drafts", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'VariationFieldsOption' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "options", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'JobComment' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "jobComments", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "jobs", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "clientJobs", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Domain' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "domainLogos", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Domain' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "domainFavicons", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'User' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "userProfilePictures", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "invoices", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "invoicesPaid", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themeMainCss", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themeMainCssUsing", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themeMainCssEditing", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themeEmailCss", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themeEmailCssUsing", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themeEmailCssEditing", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themes", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themeFeatureImages", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "themeImages", void 0);
    __decorate([
        MerchiFile.property({ arrayType: 'ProductionComment' }),
        __metadata("design:type", Array)
    ], MerchiFile.prototype, "productionComments", void 0);
    return MerchiFile;
}(Entity));
export { MerchiFile };
