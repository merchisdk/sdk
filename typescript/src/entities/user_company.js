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
var UserCompany = /** @class */ (function (_super) {
    __extends(UserCompany, _super);
    function UserCompany() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserCompany.resourceName = 'user_companies';
    UserCompany.singularName = 'userCompany';
    UserCompany.pluralName = 'userCompanies';
    __decorate([
        UserCompany.property({ type: Date }),
        __metadata("design:type", Object)
    ], UserCompany.prototype, "archived", void 0);
    __decorate([
        UserCompany.property(),
        __metadata("design:type", Number)
    ], UserCompany.prototype, "id", void 0);
    __decorate([
        UserCompany.property({ type: Boolean }),
        __metadata("design:type", Object)
    ], UserCompany.prototype, "main", void 0);
    __decorate([
        UserCompany.property(),
        __metadata("design:type", Boolean)
    ], UserCompany.prototype, "isAdmin", void 0);
    __decorate([
        UserCompany.property({ type: User }),
        __metadata("design:type", Object)
    ], UserCompany.prototype, "user", void 0);
    __decorate([
        UserCompany.property({ type: Company }),
        __metadata("design:type", Object)
    ], UserCompany.prototype, "company", void 0);
    return UserCompany;
}(Entity));
export { UserCompany };
