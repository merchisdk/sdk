import { generateUUID } from './uuid.js';
import { notEmptyArray, isUndefinedOrNull,
    removeObjectFromArrayWithIntegerValue } from './helpers.js';
import { addPropertyTo, getList, fromJsonList, deleteOne, patchOne, fromJson,
    serialise, getOne, create, enumerateFiles, Request } from './model.js';
import { productTypesInts } from './product_types.js';
import { Category } from './category.js';
import { Component } from './component.js';
import { Company } from './company.js';
import { CountryTax } from './country_tax.js';
import { DraftTemplate } from './draft_template.js';
import { DomainTag } from './domain_tag.js';
import { DiscountGroup } from './discount_group.js';
import { Domain } from './domain.js';
import { Inventory } from './inventory.js';
import { ShipmentMethod } from './shipment_method.js';
import { VariationField } from './variation_field.js';
import { VariationsGroup } from './variations_group.js';
import { MerchiFile } from './merchi_file.js';
import { SupplyDomain } from './supply_domain.js';
import { User } from './user.js';
import { Job } from './job.js';
import { SeoDomainPage } from './seo_domain_page.js';
import { InternalTag } from './internal_tag.js';

export function Product() {
    this.resource = '/products';
    this.json = 'product';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'created');
    addPropertyTo(this, 'updated');
    addPropertyTo(this, 'country');
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'createdBy', User);
    addPropertyTo(this, 'updatedBy', User);
    addPropertyTo(this, 'independent');
    addPropertyTo(this, 'productType');
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'notes');
    addPropertyTo(this, 'shopifyProductId');
    addPropertyTo(this, 'minimum');
    addPropertyTo(this, 'minimumPerGroup');
    addPropertyTo(this, 'deliveryDaysNormal');
    addPropertyTo(this, 'unitPrice');
    addPropertyTo(this, 'unitPriceDiscountGroup', DiscountGroup);
    addPropertyTo(this, 'bestPrice');
    addPropertyTo(this, 'unitWeight');
    addPropertyTo(this, 'unitHeight');
    addPropertyTo(this, 'unitWidth');
    addPropertyTo(this, 'unitDepth');
    addPropertyTo(this, 'unitVolume');
    addPropertyTo(this, 'showGroupBuyStatus');
    addPropertyTo(this, 'groupBuyStatus');
    addPropertyTo(this, 'needsDrafting');
    addPropertyTo(this, 'needsProduction');
    addPropertyTo(this, 'needsShipping');
    addPropertyTo(this, 'needsInvoicing');
    addPropertyTo(this, 'needsInventory');
    addPropertyTo(this, 'showFeatureDeadline');
    addPropertyTo(this, 'featureDeadline');
    addPropertyTo(this, 'suppliers', User);
    addPropertyTo(this, 'groupVariationFields', VariationField);
    addPropertyTo(this, 'independentVariationFields', VariationField);
    addPropertyTo(this, 'originalProduct', Product);
    addPropertyTo(this, 'clonedFromProduct', Product);
    addPropertyTo(this, 'chainedSupplierProduct', Product);
    addPropertyTo(this, 'chainedSellerProducts', Product);
    addPropertyTo(this, 'chainedInventorySupplierProduct', Product);
    addPropertyTo(this, 'chainedInventorySellerProducts', Product);
    addPropertyTo(this, 'component', Component);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'suppliedByDomains', SupplyDomain);
    addPropertyTo(this, 'autoAssignProductionOnAction');
    addPropertyTo(this, 'supplyDomains', SupplyDomain);
    addPropertyTo(this, 'images', MerchiFile);
    addPropertyTo(this, 'featureImage', MerchiFile);
    addPropertyTo(this, 'publicFiles', MerchiFile);
    addPropertyTo(this, 'productionFiles', MerchiFile);
    addPropertyTo(this, 'showPublic');
    addPropertyTo(this, 'acceptSquare');
    addPropertyTo(this, 'acceptStripe');
    addPropertyTo(this, 'acceptPaypal');
    addPropertyTo(this, 'acceptUtrust');
    addPropertyTo(this, 'acceptBankTransfer');
    addPropertyTo(this, 'acceptPhonePayment');
    addPropertyTo(this, 'supplyChainDisabled');
    addPropertyTo(this, 'allowAutomaticPaymentSupply');
    addPropertyTo(this, 'allowGroupBuy');
    addPropertyTo(this, 'allowPaymentUpfront');
    addPropertyTo(this, 'allowQuotation');
    addPropertyTo(this, 'allowChainedInventoryCreation');
    addPropertyTo(this, 'allowClientDraftContribution');
    addPropertyTo(this, 'chainedInventoryHandlingUnitPrice');
    addPropertyTo(this, 'savedByUsers', User);
    addPropertyTo(this, 'savedByCompanies', Company);
    addPropertyTo(this, 'tags', DomainTag);
    addPropertyTo(this, 'inventories', Inventory);
    addPropertyTo(this, 'inventoriesOpen');
    addPropertyTo(this, 'discountGroups', DiscountGroup);
    addPropertyTo(this, 'categories', Category);
    addPropertyTo(this, 'taxType', CountryTax);
    addPropertyTo(this, 'defaultJob', Job);
    addPropertyTo(this, 'supplyChainRequestJobs', Job);
    addPropertyTo(this, 'draftTemplates', DraftTemplate);
    addPropertyTo(this, 'shipmentMethods', ShipmentMethod);
    addPropertyTo(this, 'seoDomainPages', SeoDomainPage);
    addPropertyTo(this, 'aiContext');
    addPropertyTo(this, 'internalUseNotes');
    addPropertyTo(this, 'internalUseAiContext');
    addPropertyTo(this, 'internalTags', InternalTag);

    this.create = function (success, error, embed, asDomain) {
        var data = serialise(this),
            self = this,
            domain = self.domain() ? self.domain().id() : null,
            domainId = isUndefinedOrNull(asDomain) ? domain : asDomain;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: domainId,
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed});
    };
    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error,
                embed: embed});
    };

    this.patch = function (success, error, embed) {
        var self = this,
            data = serialise(this, undefined, undefined, undefined,
                             {excludeOld: true})[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + '/' + this.id(), success, error);
    };

    this.duplicate = function (success, error) {
        var self = this,
            request = new Request();
        request.resource('/products/' + self.id() + '/copy/');
        request.method('POST');
        function handleResponse(status, data) {
            if (status === 201) {
                success(fromJson(self, data[self.json]));
            } else {
                error(null, data);
            }
        }
        request.responseHandler(handleResponse).errorHandler(error);
        request.send();
    };

   this.company = function () {
        return this.domain() ? this.domain().company() : null;
    }
    this.variationFields = function () {
        var variationFields = [];
        if (notEmptyArray(this.groupVariationFields())) {
            variationFields = variationFields.
                concat(this.groupVariationFields());
        }

        if (notEmptyArray(this.independentVariationFields())) {
            variationFields = variationFields.
                concat(this.independentVariationFields());
        }
        return variationFields;
    };

    this.removeVariation = function (variation) {
        var variations = !variation.independent() ?
            this.groupVariationFields() : this.independentVariationFields();
        return removeObjectFromArrayWithIntegerValue(
            variations, 'id', variation.id());
    };

    this.primaryImage = function () {
        var feature = this.featureImage(),
            images = this.images(),
            firstImage = images && images[0] ? images[0] : null;
        return feature ? feature : firstImage;
    };

    this.productPrimaryImage = function () {
        return this.primaryImage() ? this.primaryImage().viewUrl() : null;
    };

    this.productCurrency = function () {
        var domain = this.domain();
        return domain && domain.company() ?
            domain.company().defaultCurrency() : null;
    };

    this.hasGroupVariationFields = function () {
        return notEmptyArray(this.groupVariationFields());
    };

    this.hasIndependentVariationFields = function () {
        return notEmptyArray(this.independentVariationFields());
    };

    this.buildEmptyVariationGroup = function () {
        var variationsGroupBuilt = new VariationsGroup(),
            groupVariationFields = this.groupVariationFields(),
            emptyGroupCost = 0,
            variations = [],
            i,
            emptyVariation;
        variationsGroupBuilt.quantity('0');

        for (i = 0; i < groupVariationFields.length; i++) {
            emptyVariation =
                groupVariationFields[i].buildEmptyVariation();
            variations.push(emptyVariation);
            emptyGroupCost += parseFloat(emptyVariation.cost(), 10);
        }

        variationsGroupBuilt.groupCost(emptyGroupCost.toString());
        variationsGroupBuilt.variations(variations);
        return variationsGroupBuilt;
    };

    this.buildEmptyVariations = function () {
        var emptyVariations = [],
            emptyVariation,
            independentVariationFields = this.independentVariationFields(),
            i;

        for (i = 0; i < independentVariationFields.length; i++) {
            emptyVariation =
                independentVariationFields[i].buildEmptyVariation();
            emptyVariations.push(emptyVariation);
        }
        return emptyVariations;
    };

    this.tax = function () {
        return this.taxType();
    };

    this.previewImages = function (maxImages) {
        var files = this.images();
        if (Boolean(files)) {
            return files.slice(0, maxImages);
        }
        return [];
    };

    this.stripePublishableKey = function () {
        return this.domain().company() ?
            this.domain().company().stripePublishableKey() : null;
    };

    this.stripeIsValidAndActive = function () {
        const company = this.domain().company();
        return this.stripePublishableKey() && company &&
            company.acceptStripe();
    };

    this.isSupplierMOD = function () {
        return this.productType() ===
            productTypesInts.get('Supplier MOD (made on demand)');
    };

    this.isResell = function () {
        return this.isSupplierMOD();
    };
}

export function Products() {
    this.resource = '/products';
    this.json = 'products';
    this.single = Product;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
