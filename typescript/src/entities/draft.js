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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { User } from './user';
var Draft = /** @class */ (function (_super) {
    __extends(Draft, _super);
    function Draft() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wereChangesRequested = function () {
            var e_1, _a;
            /* true if any comment is/was a change request comment. */
            if (_this.comments === undefined) {
                throw 'comments is undefined. did you forget to embed it?';
            }
            try {
                for (var _b = __values(_this.comments), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var comment = _c.value;
                    if (comment.changeRequest === undefined) {
                        throw 'changeRequest is undefined.';
                    }
                    if (comment.changeRequest) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return false;
        };
        _this.commentsYoungestToEldest = function () {
            if (_this.comments === undefined) {
                throw 'comments is undefined. did you forget to embed it?';
            }
            return _this.comments.sort(function (a, b) {
                if (a.id === undefined || b.id === undefined) {
                    throw 'comment id is undefined. did you forget to embed it?';
                }
                return a.id - b.id;
            });
        };
        return _this;
    }
    Draft.resourceName = 'drafts';
    Draft.singularName = 'draft';
    Draft.pluralName = 'drafts';
    __decorate([
        Draft.property({ type: Date }),
        __metadata("design:type", Object)
    ], Draft.prototype, "archived", void 0);
    __decorate([
        Draft.property(),
        __metadata("design:type", Number)
    ], Draft.prototype, "id", void 0);
    __decorate([
        Draft.property({ type: Date }),
        __metadata("design:type", Object)
    ], Draft.prototype, "date", void 0);
    __decorate([
        Draft.property({ type: Date }),
        __metadata("design:type", Object)
    ], Draft.prototype, "accepted", void 0);
    __decorate([
        Draft.property({ type: Date }),
        __metadata("design:type", Object)
    ], Draft.prototype, "resendDate", void 0);
    __decorate([
        Draft.property(),
        __metadata("design:type", Boolean)
    ], Draft.prototype, "viewed", void 0);
    __decorate([
        Draft.property(),
        __metadata("design:type", Boolean)
    ], Draft.prototype, "sendSms", void 0);
    __decorate([
        Draft.property(),
        __metadata("design:type", Boolean)
    ], Draft.prototype, "sendEmail", void 0);
    __decorate([
        Draft.property({ arrayType: 'DraftComment' }),
        __metadata("design:type", Array)
    ], Draft.prototype, "comments", void 0);
    __decorate([
        Draft.property(),
        __metadata("design:type", User)
    ], Draft.prototype, "designer", void 0);
    __decorate([
        Draft.property(),
        __metadata("design:type", MerchiFile)
    ], Draft.prototype, "file", void 0);
    __decorate([
        Draft.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], Draft.prototype, "notification", void 0);
    __decorate([
        Draft.property(),
        __metadata("design:type", Job)
    ], Draft.prototype, "job", void 0);
    return Draft;
}(Entity));
export { Draft };
