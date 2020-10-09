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
import { Assignment } from './assignment';
import { Domain } from './domain';
import { Draft } from './draft';
import { DraftComment } from './draft_comment';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Invoice } from './invoice';
import { Job } from './job';
import { JobComment } from './job_comment';
import { ProductionComment } from './production_comment';
import { ShortUrl } from './short_url';
import { User } from './user';
var Notification = /** @class */ (function (_super) {
    __extends(Notification, _super);
    function Notification() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Notification.resourceName = 'notifications';
    Notification.singularName = 'notification';
    Notification.pluralName = 'notifications';
    __decorate([
        Notification.property({ type: Date }),
        __metadata("design:type", Object)
    ], Notification.prototype, "archived", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Number)
    ], Notification.prototype, "id", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Number)
    ], Notification.prototype, "notificationType", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Date)
    ], Notification.prototype, "date", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Boolean)
    ], Notification.prototype, "seen", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Boolean)
    ], Notification.prototype, "sendEmail", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Boolean)
    ], Notification.prototype, "sendSms", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Number)
    ], Notification.prototype, "urgency", void 0);
    __decorate([
        Notification.property({ type: String }),
        __metadata("design:type", Object)
    ], Notification.prototype, "description", void 0);
    __decorate([
        Notification.property({ type: String }),
        __metadata("design:type", Object)
    ], Notification.prototype, "subject", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", String)
    ], Notification.prototype, "message", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", String)
    ], Notification.prototype, "htmlMessage", void 0);
    __decorate([
        Notification.property({ type: String }),
        __metadata("design:type", Object)
    ], Notification.prototype, "link", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Number)
    ], Notification.prototype, "section", void 0);
    __decorate([
        Notification.property({ type: ShortUrl }),
        __metadata("design:type", Object)
    ], Notification.prototype, "shortUrl", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", User)
    ], Notification.prototype, "recipient", void 0);
    __decorate([
        Notification.property({ type: User }),
        __metadata("design:type", Object)
    ], Notification.prototype, "sender", void 0);
    __decorate([
        Notification.property({ type: Job }),
        __metadata("design:type", Object)
    ], Notification.prototype, "relatedJob", void 0);
    __decorate([
        Notification.property({ type: Draft }),
        __metadata("design:type", Object)
    ], Notification.prototype, "relatedDraft", void 0);
    __decorate([
        Notification.property({ type: Assignment }),
        __metadata("design:type", Object)
    ], Notification.prototype, "relatedAssignment", void 0);
    __decorate([
        Notification.property({ type: Invoice }),
        __metadata("design:type", Object)
    ], Notification.prototype, "relatedInvoice", void 0);
    __decorate([
        Notification.property({ type: JobComment }),
        __metadata("design:type", Object)
    ], Notification.prototype, "relatedJobComment", void 0);
    __decorate([
        Notification.property({ type: DraftComment }),
        __metadata("design:type", Object)
    ], Notification.prototype, "relatedDraftComment", void 0);
    __decorate([
        Notification.property({ type: ProductionComment }),
        __metadata("design:type", Object)
    ], Notification.prototype, "relatedProductionComment", void 0);
    __decorate([
        Notification.property(),
        __metadata("design:type", Domain)
    ], Notification.prototype, "domain", void 0);
    __decorate([
        Notification.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], Notification.prototype, "attachment", void 0);
    return Notification;
}(Entity));
export { Notification };
