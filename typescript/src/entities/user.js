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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { Entity } from '../entity';
import { Role, DOMAIN_MANAGERS, MANAGEMENT_TEAM, BUSINESS_ACCOUNTS, ROLES_RANK } from '../constants/roles';
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.publicCreate = _this.createFactory({ resourceName: 'public-user-create' });
        _this.roleInDomain = function (domain) {
            if (_this.enrolledDomains === undefined) {
                var err = 'enrolledDomains is undefined, did you forget to embed it?';
                throw new Error(err);
            }
            if (_this.enrolledDomains
                .map(function (enrolledDomain) { return enrolledDomain.domain; })
                .some(function (domain) { return domain === undefined; })) {
                var err = 'Domain of enrolled domain is undefined, did you forget to embed it?';
                throw new Error(err);
            }
            var matchingEnrolledDomains = _this.enrolledDomains.filter(function (enrolledDomain) { return enrolledDomain.domain && enrolledDomain.domain.id === domain.id; });
            if (matchingEnrolledDomains.length > 1) {
                var highestRoleRank = Math.max.apply(Math, __spread(matchingEnrolledDomains.map(function (ed) { return ROLES_RANK.findIndex(function (e) { return e === ed.role; }); })));
                return ROLES_RANK[highestRoleRank];
            }
            // due to some current system issues, user can have multiple enrolled domain
            // of one domain, if that is the case either of them can be consider as
            // valid, need to revisit it in the future related to #
            if (matchingEnrolledDomains.length > 0) {
                if (matchingEnrolledDomains[0].role !== undefined) {
                    return matchingEnrolledDomains[0].role;
                }
            }
            return Role.PUBLIC;
        };
        return _this;
    }
    User.prototype.isDomainManager = function (domain) {
        return DOMAIN_MANAGERS.includes(this.roleInDomain(domain));
    };
    User.prototype.isManagementTeam = function (domain) {
        return MANAGEMENT_TEAM.includes(this.roleInDomain(domain));
    };
    User.prototype.isNotClient = function (domain) {
        return BUSINESS_ACCOUNTS.includes(this.roleInDomain(domain));
    };
    User.prototype.domainsByRoles = function (roles) {
        if (this.enrolledDomains === undefined) {
            var err = 'enrolledDomains is undefined, did you forget to embed it?';
            throw new Error(err);
        }
        var result = [];
        for (var i = 0; i < this.enrolledDomains.length; ++i) {
            var domain = this.enrolledDomains[i].domain;
            if (domain === undefined) {
                var err = 'domain is undefined, did you forget to embed it?';
                throw new Error(err);
            }
            if (this.hasAuthority(domain, roles)) {
                result.push(domain);
            }
        }
        return result;
    };
    User.prototype.hasAuthority = function (domain, roles) {
        if (this.isSuperUser === undefined) {
            var err = 'isSuperUser is undefined, did you forget to embed it?';
            throw new Error(err);
        }
        if (this.isSuperUser) {
            return true;
        }
        var role = this.roleInDomain(domain);
        for (var i = 0; i < roles.length; ++i) {
            if (roles[i] === role) {
                return true;
            }
        }
        return false;
    };
    User.resourceName = 'users';
    User.singularName = 'user';
    User.pluralName = 'users';
    __decorate([
        User.property({ type: Date }),
        __metadata("design:type", Object)
    ], User.prototype, "archived", void 0);
    __decorate([
        User.property(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        User.property(),
        __metadata("design:type", Boolean)
    ], User.prototype, "isSuperUser", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "password", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "salt", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "facebookUserId", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "resetToken", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "resetTokenDate", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "smsToken", void 0);
    __decorate([
        User.property({ type: Date }),
        __metadata("design:type", Object)
    ], User.prototype, "resetSmsTokenDate", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "smsClientToken", void 0);
    __decorate([
        User.property(),
        __metadata("design:type", Boolean)
    ], User.prototype, "smsTokenConfirmed", void 0);
    __decorate([
        User.property(),
        __metadata("design:type", Number)
    ], User.prototype, "smsLoginThreshold", void 0);
    __decorate([
        User.property(),
        __metadata("design:type", Boolean)
    ], User.prototype, "enableCrashReports", void 0);
    __decorate([
        User.property(),
        __metadata("design:type", Boolean)
    ], User.prototype, "enableClientEmails", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "clientToken", void 0);
    __decorate([
        User.property(),
        __metadata("design:type", String)
    ], User.prototype, "name", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "comments", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "timezone", void 0);
    __decorate([
        User.property({ type: Date }),
        __metadata("design:type", Object)
    ], User.prototype, "created", void 0);
    __decorate([
        User.property({ type: String }),
        __metadata("design:type", Object)
    ], User.prototype, "preferredLanguage", void 0);
    __decorate([
        User.property(),
        __metadata("design:type", Boolean)
    ], User.prototype, "enableInvoiceReminders", void 0);
    __decorate([
        User.property({ arrayType: 'JobComment' }),
        __metadata("design:type", Array)
    ], User.prototype, "jobComments", void 0);
    __decorate([
        User.property({ arrayType: 'EmailAddress' }),
        __metadata("design:type", Array)
    ], User.prototype, "_emailAddresses", void 0);
    __decorate([
        User.property({ arrayType: 'PhoneNumber' }),
        __metadata("design:type", Array)
    ], User.prototype, "_phoneNumbers", void 0);
    __decorate([
        User.property({ arrayType: 'Address' }),
        __metadata("design:type", Array)
    ], User.prototype, "_addresses", void 0);
    __decorate([
        User.property({ arrayType: 'UserCompany' }),
        __metadata("design:type", Array)
    ], User.prototype, "_companies", void 0);
    __decorate([
        User.property({ arrayType: 'Category' }),
        __metadata("design:type", Array)
    ], User.prototype, "categories", void 0);
    __decorate([
        User.property({ arrayType: 'Product' }),
        __metadata("design:type", Array)
    ], User.prototype, "products", void 0);
    __decorate([
        User.property({ type: 'MerchiFile' }),
        __metadata("design:type", Object)
    ], User.prototype, "profilePicture", void 0);
    __decorate([
        User.property({ arrayType: 'PhoneNumber' }),
        __metadata("design:type", Array)
    ], User.prototype, "phoneNumbers", void 0);
    __decorate([
        User.property({ arrayType: 'Session' }),
        __metadata("design:type", Array)
    ], User.prototype, "sessions", void 0);
    __decorate([
        User.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], User.prototype, "shipmentsAsSender", void 0);
    __decorate([
        User.property({ arrayType: 'Shipment' }),
        __metadata("design:type", Array)
    ], User.prototype, "shipmentsAsReceiver", void 0);
    __decorate([
        User.property({ arrayType: 'DraftComment' }),
        __metadata("design:type", Array)
    ], User.prototype, "draftComments", void 0);
    __decorate([
        User.property({ arrayType: 'DraftComment' }),
        __metadata("design:type", Array)
    ], User.prototype, "forwardedDraftComments", void 0);
    __decorate([
        User.property({ arrayType: 'SystemRole' }),
        __metadata("design:type", Array)
    ], User.prototype, "systemRoles", void 0);
    __decorate([
        User.property({ arrayType: 'EmailAddress' }),
        __metadata("design:type", Array)
    ], User.prototype, "emailAddresses", void 0);
    __decorate([
        User.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], User.prototype, "notifications", void 0);
    __decorate([
        User.property({ arrayType: 'Notification' }),
        __metadata("design:type", Array)
    ], User.prototype, "sentNotifications", void 0);
    __decorate([
        User.property({ arrayType: 'Assignment' }),
        __metadata("design:type", Array)
    ], User.prototype, "assignments", void 0);
    __decorate([
        User.property({ arrayType: 'UserCompany' }),
        __metadata("design:type", Array)
    ], User.prototype, "userCompanies", void 0);
    __decorate([
        User.property({ arrayType: 'Draft' }),
        __metadata("design:type", Array)
    ], User.prototype, "drafts", void 0);
    __decorate([
        User.property({ arrayType: 'CompanyInvitation' }),
        __metadata("design:type", Array)
    ], User.prototype, "companyInvitations", void 0);
    __decorate([
        User.property({ arrayType: 'Address' }),
        __metadata("design:type", Array)
    ], User.prototype, "addresses", void 0);
    __decorate([
        User.property({ arrayType: 'MerchiFile' }),
        __metadata("design:type", Array)
    ], User.prototype, "uploadFiles", void 0);
    __decorate([
        User.property({ arrayType: 'JobComment' }),
        __metadata("design:type", Array)
    ], User.prototype, "forwardedJobComments", void 0);
    __decorate([
        User.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], User.prototype, "appliedJobs", void 0);
    __decorate([
        User.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], User.prototype, "managedJobs", void 0);
    __decorate([
        User.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], User.prototype, "draftingJobs", void 0);
    __decorate([
        User.property({ arrayType: 'Product' }),
        __metadata("design:type", Array)
    ], User.prototype, "saved_products", void 0);
    __decorate([
        User.property({ arrayType: 'Cart' }),
        __metadata("design:type", Array)
    ], User.prototype, "carts", void 0);
    __decorate([
        User.property({ arrayType: 'Payment' }),
        __metadata("design:type", Array)
    ], User.prototype, "payments", void 0);
    __decorate([
        User.property({ arrayType: 'EnrolledDomain' }),
        __metadata("design:type", Array)
    ], User.prototype, "enrolledDomains", void 0);
    __decorate([
        User.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], User.prototype, "responsibleInvoices", void 0);
    __decorate([
        User.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], User.prototype, "createdInvoices", void 0);
    __decorate([
        User.property({ arrayType: 'Invoice' }),
        __metadata("design:type", Array)
    ], User.prototype, "invoicesHas", void 0);
    __decorate([
        User.property({ arrayType: 'DomainInvitation' }),
        __metadata("design:type", Array)
    ], User.prototype, "sentDomainInvitations", void 0);
    __decorate([
        User.property({ arrayType: 'DomainInvitation' }),
        __metadata("design:type", Array)
    ], User.prototype, "receivedDomainInvitations", void 0);
    __decorate([
        User.property({ arrayType: 'Theme' }),
        __metadata("design:type", Array)
    ], User.prototype, "themes", void 0);
    __decorate([
        User.property({ arrayType: 'ProductionComment' }),
        __metadata("design:type", Array)
    ], User.prototype, "forwardedProductionComments", void 0);
    return User;
}(Entity));
export { User };
