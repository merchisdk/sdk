var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Session } from './entities/session';
import { JobComment } from './entities/job_comment';
import { Domain } from './entities/domain';
import { Job } from './entities/job';
import { Menu } from './entities/menu';
import { Backup } from './entities/backup';
import { VariationField } from './entities/variation_field';
import { ProductionComment } from './entities/production_comment';
import { Product } from './entities/product';
import { Inventory } from './entities/inventory';
import { BidItem } from './entities/bid_item';
import { Category } from './entities/category';
import { Invoice } from './entities/invoice';
import { UserCompany } from './entities/user_company';
import { InventoryUnitVariation } from './entities/inventory_unit_variation';
import { VariationFieldsOption } from './entities/variation_fields_option';
import { Bank } from './entities/bank';
import { Shipment } from './entities/shipment';
import { ShipmentMethod } from './entities/shipment_method';
import { ShipmentMethodVariation } from './entities/shipment_method_variation';
import { DomainInvitation } from './entities/domain_invitation';
import { EmailCounter } from './entities/email_counter';
import { MenuItem } from './entities/menu_item';
import { SupplyDomain } from './entities/supply_domain';
import { Cart } from './entities/cart';
import { Theme } from './entities/theme';
import { Component } from './entities/component';
import { MerchiFile } from './entities/file';
import { EmailAddress } from './entities/email_address';
import { ShortUrl } from './entities/short_url';
import { VariationsGroup } from './entities/variations_group';
import { Bid } from './entities/bid';
import { Draft } from './entities/draft';
import { Discount } from './entities/discount';
import { User } from './entities/user';
import { Company } from './entities/company';
import { ComponentTag } from './entities/component_tag';
import { EnrolledDomain } from './entities/enrolled_domain';
import { CountryTax } from './entities/country_tax';
import { Item } from './entities/item';
import { DomainTag } from './entities/domain_tag';
import { DraftComment } from './entities/draft_comment';
import { Notification } from './entities/notification';
import { Payment } from './entities/payment';
import { Page } from './entities/page';
import { CompanyInvitation } from './entities/company_invitation';
import { SystemRole } from './entities/system_role';
import { PhoneNumber } from './entities/phone_number';
import { Variation } from './entities/variation';
import { CartItem } from './entities/cart_item';
import { Address } from './entities/address';
import { Assignment } from './entities/assignment';
import { MatchingInventory } from './entities/matching_inventory';
import { SubscriptionPlan } from './entities/subscription_plan';
import { generateUUID } from './uuid';
// eslint-disable-next-line no-unused-vars
import { apiFetch } from './request';
import { getCookie } from './cookie';
function cloneClass(original, arg) {
    // copy the constructor, but use the empty object as `this`
    var copy = original.bind({}, arg);
    // pick up any static members (this is shallow, the members are not copied)
    Object.assign(copy, original);
    return copy;
}
var Merchi = /** @class */ (function () {
    function Merchi(sessionToken) {
        var _this = this;
        this.id = generateUUID();
        this.authenticatedFetch = function (resource, options, expectEmptyResponse) {
            if (_this.sessionToken) {
                /* istanbul ignore next */
                if (!options.query) {
                    /* istanbul ignore next */
                    options.query = [];
                }
                options.query.push(['session_token', _this.sessionToken]);
            }
            return apiFetch(resource, options, expectEmptyResponse);
        };
        this.getCurrentUser = function (options) {
            var _a = (options || {}).embed, embed = _a === void 0 ? {} : _a;
            var defaultEmbed = { user: { enrolledDomains: { domain: {} } } };
            if (!_this.sessionToken) {
                return Promise.resolve(null);
            }
            return _this.Session.get(_this.sessionToken, {
                embed: __assign(__assign({}, defaultEmbed), embed),
            }).then(function (session) { return session.user; });
        };
        if (sessionToken) {
            this.sessionToken = sessionToken;
        }
        else {
            this.sessionToken = getCookie('session_token');
        }
        // re-export configured versions of all classes
        this.Variation = this.setupClass(Variation);
        this.DraftComment = this.setupClass(DraftComment);
        this.Component = this.setupClass(Component);
        this.Theme = this.setupClass(Theme);
        this.Company = this.setupClass(Company);
        this.MenuItem = this.setupClass(MenuItem);
        this.Inventory = this.setupClass(Inventory);
        this.Notification = this.setupClass(Notification);
        this.Shipment = this.setupClass(Shipment);
        this.ShipmentMethod = this.setupClass(ShipmentMethod);
        this.ShipmentMethodVariation = this.setupClass(ShipmentMethodVariation);
        this.Domain = this.setupClass(Domain);
        this.Invoice = this.setupClass(Invoice);
        this.Job = this.setupClass(Job);
        this.ComponentTag = this.setupClass(ComponentTag);
        this.Category = this.setupClass(Category);
        this.VariationField = this.setupClass(VariationField);
        this.InventoryUnitVariation = this.setupClass(InventoryUnitVariation);
        this.PhoneNumber = this.setupClass(PhoneNumber);
        this.BidItem = this.setupClass(BidItem);
        this.Menu = this.setupClass(Menu);
        this.Assignment = this.setupClass(Assignment);
        this.Draft = this.setupClass(Draft);
        this.VariationsGroup = this.setupClass(VariationsGroup);
        this.EnrolledDomain = this.setupClass(EnrolledDomain);
        this.CompanyInvitation = this.setupClass(CompanyInvitation);
        this.Bid = this.setupClass(Bid);
        this.EmailAddress = this.setupClass(EmailAddress);
        this.ProductionComment = this.setupClass(ProductionComment);
        this.Backup = this.setupClass(Backup);
        this.CountryTax = this.setupClass(CountryTax);
        this.ShortUrl = this.setupClass(ShortUrl);
        this.Product = this.setupClass(Product);
        this.SystemRole = this.setupClass(SystemRole);
        this.CartItem = this.setupClass(CartItem);
        this.UserCompany = this.setupClass(UserCompany);
        this.DomainTag = this.setupClass(DomainTag);
        this.VariationFieldsOption = this.setupClass(VariationFieldsOption);
        this.Address = this.setupClass(Address);
        this.Item = this.setupClass(Item);
        this.SupplyDomain = this.setupClass(SupplyDomain);
        this.DomainInvitation = this.setupClass(DomainInvitation);
        this.EmailCounter = this.setupClass(EmailCounter);
        this.Session = this.setupClass(Session);
        this.Bank = this.setupClass(Bank);
        this.Discount = this.setupClass(Discount);
        this.Payment = this.setupClass(Payment);
        this.Page = this.setupClass(Page);
        this.Cart = this.setupClass(Cart);
        this.MerchiFile = this.setupClass(MerchiFile);
        this.User = this.setupClass(User);
        this.JobComment = this.setupClass(JobComment);
        this.MatchingInventory = this.setupClass(MatchingInventory);
        this.SubscriptionPlan = this.setupClass(SubscriptionPlan);
    }
    Merchi.prototype.setupClass = function (cls) {
        var result = cloneClass(cls, this);
        result.merchi = this;
        return result;
    };
    return Merchi;
}());
export { Merchi };
