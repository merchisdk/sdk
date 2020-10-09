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
import { Draft } from './draft';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { User } from './user';
var DraftComment = /** @class */ (function (_super) {
    __extends(DraftComment, _super);
    function DraftComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraftComment.resourceName = 'draft_comments';
    DraftComment.singularName = 'draftComment';
    DraftComment.pluralName = 'draftComments';
    __decorate([
        DraftComment.property({ type: Date }),
        __metadata("design:type", Object)
    ], DraftComment.prototype, "archived", void 0);
    __decorate([
        DraftComment.property(),
        __metadata("design:type", Number)
    ], DraftComment.prototype, "id", void 0);
    __decorate([
        DraftComment.property({ type: Date }),
        __metadata("design:type", Object)
    ], DraftComment.prototype, "date", void 0);
    __decorate([
        DraftComment.property(),
        __metadata("design:type", Number)
    ], DraftComment.prototype, "urgency", void 0);
    __decorate([
        DraftComment.property(),
        __metadata("design:type", String)
    ], DraftComment.prototype, "text", void 0);
    __decorate([
        DraftComment.property(),
        __metadata("design:type", Boolean)
    ], DraftComment.prototype, "changeRequest", void 0);
    __decorate([
        DraftComment.property(),
        __metadata("design:type", Boolean)
    ], DraftComment.prototype, "sendSms", void 0);
    __decorate([
        DraftComment.property(),
        __metadata("design:type", Boolean)
    ], DraftComment.prototype, "sendEmail", void 0);
    __decorate([
        DraftComment.property(),
        __metadata("design:type", User)
    ], DraftComment.prototype, "user", void 0);
    __decorate([
        DraftComment.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], DraftComment.prototype, "file", void 0);
    __decorate([
        DraftComment.property({ arrayType: 'User' }),
        __metadata("design:type", Array)
    ], DraftComment.prototype, "forwards", void 0);
    __decorate([
        DraftComment.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], DraftComment.prototype, "notifications", void 0);
    __decorate([
        DraftComment.property({ type: Draft }),
        __metadata("design:type", Object)
    ], DraftComment.prototype, "draft", void 0);
    __decorate([
        DraftComment.property({ type: Job }),
        __metadata("design:type", Object)
    ], DraftComment.prototype, "job", void 0);
    return DraftComment;
}(Entity));
export { DraftComment };
