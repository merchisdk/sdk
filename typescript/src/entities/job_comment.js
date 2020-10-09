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
import { User } from './user';
var JobComment = /** @class */ (function (_super) {
    __extends(JobComment, _super);
    function JobComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JobComment.resourceName = 'job_comments';
    JobComment.singularName = 'jobComment';
    JobComment.pluralName = 'jobComments';
    __decorate([
        JobComment.property({ type: Date }),
        __metadata("design:type", Object)
    ], JobComment.prototype, "archived", void 0);
    __decorate([
        JobComment.property(),
        __metadata("design:type", Number)
    ], JobComment.prototype, "id", void 0);
    __decorate([
        JobComment.property({ type: Date }),
        __metadata("design:type", Object)
    ], JobComment.prototype, "date", void 0);
    __decorate([
        JobComment.property(),
        __metadata("design:type", String)
    ], JobComment.prototype, "text", void 0);
    __decorate([
        JobComment.property(),
        __metadata("design:type", Boolean)
    ], JobComment.prototype, "sendSms", void 0);
    __decorate([
        JobComment.property(),
        __metadata("design:type", Boolean)
    ], JobComment.prototype, "sendEmail", void 0);
    __decorate([
        JobComment.property(),
        __metadata("design:type", Boolean)
    ], JobComment.prototype, "openToClient", void 0);
    __decorate([
        JobComment.property(),
        __metadata("design:type", Number)
    ], JobComment.prototype, "urgency", void 0);
    __decorate([
        JobComment.property({ type: Date }),
        __metadata("design:type", Object)
    ], JobComment.prototype, "file", void 0);
    __decorate([
        JobComment.property({ arrayType: 'User' }),
        __metadata("design:type", Array)
    ], JobComment.prototype, "forwards", void 0);
    __decorate([
        JobComment.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], JobComment.prototype, "notifications", void 0);
    __decorate([
        JobComment.property(),
        __metadata("design:type", Job)
    ], JobComment.prototype, "job", void 0);
    __decorate([
        JobComment.property(),
        __metadata("design:type", User)
    ], JobComment.prototype, "user", void 0);
    return JobComment;
}(Entity));
export { JobComment };
