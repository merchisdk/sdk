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
import { Domain } from './domain';
import { Entity } from '../entity';
import { MerchiFile } from './file';
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.duplicate = function () {
            /* create a clone of this product on the backend, returning it. */
            var constructor = _this.constructor;
            var resourceName = constructor.resourceName;
            var singularName = constructor.singularName;
            var resource = "/" + resourceName + "/" + String(_this.id) + "/copy/";
            var fetchOptions = { method: 'POST' };
            return _this.merchi.authenticatedFetch(resource, fetchOptions).
                then(function (data) {
                var product = new _this.merchi.Product();
                product.fromJson(data[singularName]);
                return product;
            });
        };
        _this.primaryImage = function () {
            if (_this.featureImage === undefined) {
                throw new Error('featureImage is undefined, did you forget to embed it?');
            }
            if (_this.images === undefined) {
                throw new Error('images is undefined, did you forget to embed it?');
            }
            if (_this.featureImage !== null) {
                return _this.featureImage;
            }
            if (_this.images.length > 0) {
                return _this.images[0];
            }
            return null;
        };
        _this.currency = function () {
            if (_this.domain === undefined) {
                throw new Error('domain is undefined, did you forget to embed it?');
            }
            return _this.domain.defaultCurrency();
        };
        _this.hasGroupVariationFields = function () {
            if (_this.groupVariationFields === undefined) {
                var err = 'groupVariationFields is undefined, did you forget to embed' +
                    ' it?';
                throw new Error(err);
            }
            return _this.groupVariationFields.length > 0;
        };
        _this.hasIndependentVariationFields = function () {
            if (_this.independentVariationFields === undefined) {
                var err = 'independentVariationFields is undefined, did you forget to' +
                    ' embed it?';
                throw new Error(err);
            }
            return _this.independentVariationFields.length > 0;
        };
        _this.taxType = function () {
            if (_this.domain === undefined) {
                throw new Error('domain is undefined, did you forget to embed it?');
            }
            return _this.domain.defaultTaxType();
        };
        _this.allVariationFields = function () {
            if (_this.groupVariationFields === undefined) {
                var err = 'groupVariationFields is undefined, did you forget to embed' +
                    ' it?';
                throw new Error(err);
            }
            if (_this.independentVariationFields === undefined) {
                var err = 'independentVariationFields is undefined, did you forget to' +
                    ' embed it?';
                throw new Error(err);
            }
            var result = [];
            return result.concat(_this.groupVariationFields, _this.independentVariationFields);
        };
        _this.buildEmptyVariations = function () {
            if (_this.independentVariationFields === undefined) {
                var err = 'independentVariationFields is undefined, did you forget to' +
                    ' embed it?';
                throw new Error(err);
            }
            return _this.independentVariationFields.map(function (field) {
                return field.buildEmptyVariation();
            });
        };
        _this.buildEmptyVariationGroup = function () {
            var e_1, _a;
            if (_this.groupVariationFields === undefined) {
                var err = 'groupVariationFields is undefined, did you forget to embed' +
                    ' it?';
                throw new Error(err);
            }
            var result = new _this.merchi.VariationsGroup();
            var variations = [];
            var cost = 0;
            result.quantity = 0;
            try {
                for (var _b = __values(_this.groupVariationFields), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var variationField = _c.value;
                    var empty = variationField.buildEmptyVariation();
                    variations.push(empty);
                    cost += empty.cost;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            result.groupCost = cost;
            result.variations = variations;
            return result;
        };
        _this.removeVariationField = function (variationField) {
            if (variationField.independent === undefined) {
                throw new Error('variation.independent is undefined, did you ' +
                    'forget to embed it?');
            }
            if (_this.independentVariationFields === undefined) {
                var err = 'independentVariationFields is undefined, did you forget to' +
                    ' embed it?';
                throw new Error(err);
            }
            if (_this.groupVariationFields === undefined) {
                var err = 'groupVariationFields is undefined, did you forget to embed' +
                    ' it?';
                throw new Error(err);
            }
            var variationFields = variationField.independent ?
                _this.independentVariationFields : _this.groupVariationFields;
            var index = variationFields.findIndex(function (v) {
                if (v.id === undefined) {
                    throw new Error('variation id is undefined, did you forget to ' +
                        'embed it?');
                }
                return v.id === variationField.id;
            });
            return variationFields.splice(index, 1);
        };
        return _this;
    }
    Product.resourceName = 'products';
    Product.singularName = 'product';
    Product.pluralName = 'products';
    __decorate([
        Product.property({ type: Date }),
        __metadata("design:type", Object)
    ], Product.prototype, "archived", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "id", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "productType", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "minimum", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "deliveryDaysNormal", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "unitPrice", void 0);
    __decorate([
        Product.property({ type: Number }),
        __metadata("design:type", Object)
    ], Product.prototype, "unitWeight", void 0);
    __decorate([
        Product.property({ type: Number }),
        __metadata("design:type", Object)
    ], Product.prototype, "unitHeight", void 0);
    __decorate([
        Product.property({ type: Number }),
        __metadata("design:type", Object)
    ], Product.prototype, "unitWidth", void 0);
    __decorate([
        Product.property({ type: Number }),
        __metadata("design:type", Object)
    ], Product.prototype, "unitDepth", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", String)
    ], Product.prototype, "name", void 0);
    __decorate([
        Product.property({ type: String }),
        __metadata("design:type", Object)
    ], Product.prototype, "description", void 0);
    __decorate([
        Product.property({ type: String }),
        __metadata("design:type", Object)
    ], Product.prototype, "notes", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "needsDrafting", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "needsProduction", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "needsShipping", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "showPublic", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "acceptStripe", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "acceptPaypal", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "acceptBankTransfer", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "acceptPhonePayment", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "allowPaymentUpfront", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Boolean)
    ], Product.prototype, "allowQuotation", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "bestPrice", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Number)
    ], Product.prototype, "unitVolume", void 0);
    __decorate([
        Product.property({ arrayType: 'Category' }),
        __metadata("design:type", Array)
    ], Product.prototype, "categories", void 0);
    __decorate([
        Product.property({ arrayType: 'Discount' }),
        __metadata("design:type", Array)
    ], Product.prototype, "discounts", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Domain)
    ], Product.prototype, "domain", void 0);
    __decorate([
        Product.property(),
        __metadata("design:type", Product)
    ], Product.prototype, "originalProduct", void 0);
    __decorate([
        Product.property({ arrayType: 'MerchiFile' }),
        __metadata("design:type", Array)
    ], Product.prototype, "images", void 0);
    __decorate([
        Product.property({ arrayType: 'VariationField' }),
        __metadata("design:type", Array)
    ], Product.prototype, "groupVariationFields", void 0);
    __decorate([
        Product.property({ arrayType: 'VariationField' }),
        __metadata("design:type", Array)
    ], Product.prototype, "independentVariationFields", void 0);
    __decorate([
        Product.property({ arrayType: 'DomainTag' }),
        __metadata("design:type", Array)
    ], Product.prototype, "tags", void 0);
    __decorate([
        Product.property({ type: MerchiFile }),
        __metadata("design:type", Object)
    ], Product.prototype, "featureImage", void 0);
    __decorate([
        Product.property({ arrayType: 'Company', jsonName: 'saved_by_companies' }),
        __metadata("design:type", Array)
    ], Product.prototype, "savedByCompanies", void 0);
    __decorate([
        Product.property({ arrayType: 'SupplyDomain' }),
        __metadata("design:type", Array)
    ], Product.prototype, "suppliedByDomains", void 0);
    __decorate([
        Product.property({ arrayType: 'SupplyDomain' }),
        __metadata("design:type", Array)
    ], Product.prototype, "supplyDomains", void 0);
    __decorate([
        Product.property({ arrayType: 'Inventory' }),
        __metadata("design:type", Array)
    ], Product.prototype, "inventories", void 0);
    __decorate([
        Product.property({ arrayType: 'CartItem' }),
        __metadata("design:type", Array)
    ], Product.prototype, "cartItems", void 0);
    __decorate([
        Product.property({ arrayType: 'Job' }),
        __metadata("design:type", Array)
    ], Product.prototype, "jobs", void 0);
    __decorate([
        Product.property({ arrayType: 'User', jsonName: 'saved_by_users' }),
        __metadata("design:type", Array)
    ], Product.prototype, "savedByUsers", void 0);
    __decorate([
        Product.property({ arrayType: 'User' }),
        __metadata("design:type", Array)
    ], Product.prototype, "suppliers", void 0);
    return Product;
}(Entity));
export { Product };
