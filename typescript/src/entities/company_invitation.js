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
import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';
var CompanyInvitation = /** @class */ (function (_super) {
    __extends(CompanyInvitation, _super);
    function CompanyInvitation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CompanyInvitation.resourceName = 'company_invitations';
    CompanyInvitation.singularName = 'companyInvitation';
    CompanyInvitation.pluralName = 'companyInvitations';
    __decorate([
        CompanyInvitation.property({ type: Date }),
        __metadata("design:type", Object)
    ], CompanyInvitation.prototype, "archived", void 0);
    __decorate([
        CompanyInvitation.property(),
        __metadata("design:type", Number)
    ], CompanyInvitation.prototype, "id", void 0);
    __decorate([
        CompanyInvitation.property(),
        __metadata("design:type", String)
    ], CompanyInvitation.prototype, "userName", void 0);
    __decorate([
        CompanyInvitation.property(),
        __metadata("design:type", String)
    ], CompanyInvitation.prototype, "userEmail", void 0);
    __decorate([
        CompanyInvitation.property(),
        __metadata("design:type", Boolean)
    ], CompanyInvitation.prototype, "inviteAsAdmin", void 0);
    __decorate([
        CompanyInvitation.property(),
        __metadata("design:type", String)
    ], CompanyInvitation.prototype, "token", void 0);
    __decorate([
        CompanyInvitation.property(),
        __metadata("design:type", Company)
    ], CompanyInvitation.prototype, "company", void 0);
    __decorate([
        CompanyInvitation.property(),
        __metadata("design:type", User)
    ], CompanyInvitation.prototype, "sender", void 0);
    return CompanyInvitation;
}(Entity));
export { CompanyInvitation };
