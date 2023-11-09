import * as _ from 'lodash';
import { CartItem } from './cart_item';
import { Category } from './category';
import { Company } from './company';
import { Component } from './component';
import { CountryTax } from './country_tax';
import { DiscountGroup } from './discount_group';
import { Domain } from './domain';
import { DomainTag } from './domain_tag';
import { DraftTemplate } from './draft_template';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { InternalTag } from './internal_tag';
import { Inventory } from './inventory';
import { Job } from './job';
import { SupplyDomain } from './supply_domain';
import { User } from './user';
import { VariationField } from './variation_field';
import { SeoDomainPage } from './seo_domain_page';
import { ShipmentMethod } from './shipment_method';
import {
  AutoAssignProductionOnAction
} from '../constants/auto_assign_production_on_actions';

export class Product extends Entity {
  protected static resourceName = 'products';
  protected static singularName = 'product';
  protected static pluralName = 'products';

  @Product.property({type: Date})
  public archived?: Date | null;

  @Product.property()
  public id?: number;

  @Component.property({type: Date})
  public created?: Date;

  @Component.property({type: Date})
  public updated?: Date;

  @Component.property({type: 'User'})
  public createdBy?: User | null;

  @Component.property({type: 'User'})
  public updatedBy?: User | null;

  @Product.property()
  public productType?: number;

  @Product.property()
  public minimum?: number;

  @Product.property()
  public minimumPerGroup?: boolean;

  @Product.property()
  public deliveryDaysNormal?: number;

  @Product.property()
  public unitPrice?: number;

  @Product.property({embeddedByDefault: false})
  public buyUnitPrice?: number;

  @Product.property({type: 'DiscountGroup'})
  public unitPriceDiscountGroup?: DiscountGroup | null;

  @Product.property({arrayType: 'ShipmentMethod'})
  public shipmentMethods?: ShipmentMethod[];

  @Product.property()
  public margin?: number;

  @Product.property({type: Number})
  public unitWeight?: number | null;

  @Product.property({type: Number})
  public unitHeight?: number | null;

  @Product.property({type: Number})
  public unitWidth?: number | null;

  @Product.property({type: Number})
  public unitDepth?: number | null;

  @Product.property()
  public name?: string;

  @Product.property()
  public country?: string;

  @Product.property()
  public currency?: string;

  @Product.property({type: String})
  public description?: string | null;

  @Product.property({type: String})
  public notes?: string | null;

  @Product.property({type: String})
  public internalUseNotes?: string;

  @Product.property({type: String})
  public internalUseAiContext?: string;

  @Product.property({type: String})
  public aiContext?: string;

  @Product.property({type: String})
  public shopifyProductId?: string | null;

  @Product.property()
  public useCompanyShipmentMethods?: boolean;

  @Product.property()
  public dropShipment?: boolean;

  @Product.property()
  public needsDrafting?: boolean;

  @Product.property()
  public needsProduction?: boolean;

  @Product.property()
  public needsShipping?: boolean;

  @Product.property()
  public needsInvoicing?: boolean;

  @Product.property()
  public needsInventory?: boolean;

  @Product.property({type: Date})
  public featureDeadline?: Date;

  @Product.property()
  public showFeatureDeadline?: boolean;

  @Product.property()
  public showPublic?: boolean;

  @Product.property()
  public showGroupBuyStatus?: boolean;

  @Product.property({type: Number})
  public groupBuyStatus?: number | null;

  @Product.property()
  public acceptSquare?: boolean;

  @Product.property()
  public acceptStripe?: boolean;

  @Product.property()
  public acceptPaypal?: boolean;

  @Product.property()
  public acceptUtrust?: boolean;

  @Product.property()
  public acceptBankTransfer?: boolean;

  @Product.property()
  public acceptPhonePayment?: boolean;

  @Product.property()
  public allowAutomaticPaymentSupply?: boolean;

  @Product.property()
  public allowGroupBuy?: boolean;

  @Product.property()
  public allowPaymentUpfront?: boolean;

  @Product.property()
  public allowQuotation?: boolean;

  @Product.property()
  public allowChainedInventoryCreation?: boolean;

  @Product.property()
  public allowClientDraftContribution?: boolean;

  @Product.property()
  public chainedInventoryHandlingUnitPrice?: number;

  @Product.property()
  public bestPrice?: number;

  @Product.property()
  public unitVolume?: number;

  @Product.property({arrayType: 'Category'})
  public categories?: Category[];

  @Product.property({arrayType: 'Category'})
  public platformCategories?: Category[];

  @Product.property({arrayType: 'DiscountGroup'})
  public discountGroups?: DiscountGroup[];

  @Product.property()
  public domain?: Domain;

  @Product.property({type: CountryTax})
  public taxType?: CountryTax | null;

  @Product.property({type: Product})
  public originalProduct?: Product | null;

  @Product.property({type: Product})
  public clonedFromProduct?: Product | null;

  @Product.property({type: Product})
  public chainedSupplierProduct?: Product | null;

  @Product.property({arrayType: 'Product'})
  public chainedSellerProducts?: Product[];

  @Product.property({type: Product})
  public chainedInventorySupplierProduct?: Product | null;

  @Product.property({arrayType: 'Product'})
  public chainedInventorySellerProducts?: Product[];

  @Product.property({type: Component})
  public component?: Component | null;

  @Product.property({arrayType: 'MerchiFile'})
  public images?: MerchiFile[];

  @Product.property({arrayType: 'MerchiFile'})
  public publicFiles?: MerchiFile[];

  @Product.property({arrayType: 'MerchiFile'})
  public productionFiles?: MerchiFile[];

  @Product.property({arrayType: 'VariationField'})
  public groupVariationFields?: VariationField[];

  @Product.property({arrayType: 'VariationField'})
  public independentVariationFields?: VariationField[];

  @Product.property({arrayType: 'DomainTag'})
  public tags?: DomainTag[];

  @Product.property({arrayType: 'InternalTag'})
  public internalTags?: InternalTag[];

  @Product.property({arrayType: 'SeoDomainPage'})
  public seoDomainPages?: SeoDomainPage[];

  @Product.property({type: MerchiFile})
  public featureImage?: MerchiFile | null;

  @Product.property({type: 'Job'})
  public createdByJob?: Job | null;

  @Product.property({type: 'Job'})
  public defaultJob?: Job;

  @Product.property({arrayType: 'Company', jsonName: 'saved_by_companies'})
  public savedByCompanies?: Company[];

  @Product.property({arrayType: 'SupplyDomain'})
  public suppliedByDomains?: SupplyDomain[];

  @Product.property()
  public autoAssignProductionOnAction?: AutoAssignProductionOnAction;

  @Product.property({arrayType: 'SupplyDomain'})
  public supplyDomains?: SupplyDomain[];

  @Product.property()
  public inventoriesOpen?: boolean;

  @Product.property()
  public supplyChainDisabled?: boolean;

  @Product.property({arrayType: 'Inventory'})
  public inventories?: Inventory[];

  @Product.property({arrayType: 'CartItem'})
  public cartItems?: CartItem[];

  @Product.property({arrayType: 'Job'})
  public jobs?: Job[];

  @Product.property({arrayType: 'Job'})
  public supplyChainRequestJobs?: Job[];

  @Product.property({arrayType: 'User', jsonName: 'saved_by_users'})
  public savedByUsers?: User[];

  @Product.property({arrayType: 'User'})
  public suppliers?: User[];

  @Product.property({arrayType: 'DraftTemplate'})
  public draftTemplates?: DraftTemplate[];

  public duplicate = () => {
    /* create a clone of this product on the backend, returning it. */
    const constructor = this.constructor as typeof Product;
    const resourceName = constructor.resourceName;
    const singularName = constructor.singularName;
    const resource = `/${resourceName}/${String(this.id)}/copy/`;
    const fetchOptions = {method: 'POST'};
    return this.merchi.authenticatedFetch(resource, fetchOptions).
      then((data: any) => {
        const product = new this.merchi.Product();
        product.fromJson(data[singularName]);
        return product;
      });
  };

  public primaryImage = () => {
    if (this.featureImage === undefined) {
      throw new Error('featureImage is undefined, did you forget to embed it?');
    }
    if (this.images === undefined) {
      throw new Error('images is undefined, did you forget to embed it?');
    }
    if (this.featureImage !== null) {
      return this.featureImage;
    }
    if (this.images.length > 0) {
      return this.images[0];
    }
    return null;
  };

  public hasGroupVariationFields = () => {
    if (this.groupVariationFields === undefined) {
      const err = 'groupVariationFields is undefined, did you forget to embed' +
        ' it?';
      throw new Error(err);
    }
    return this.groupVariationFields.length > 0;
  };

  public hasIndependentVariationFields = () => {
    if (this.independentVariationFields === undefined) {
      const err = 'independentVariationFields is undefined, did you forget to' +
        ' embed it?';
      throw new Error(err);
    }
    return this.independentVariationFields.length > 0;
  };

  public allVariationFields = () => {
    if (this.groupVariationFields === undefined) {
      const err = 'groupVariationFields is undefined, did you forget to embed' +
        ' it?';
      throw new Error(err);
    }
    if (this.independentVariationFields === undefined) {
      const err = 'independentVariationFields is undefined, did you forget to' +
        ' embed it?';
      throw new Error(err);
    }
    const result: VariationField[] = [];
    return result.concat(this.groupVariationFields,
      this.independentVariationFields);
  };

  public buildEmptyVariations = () => {
    if (this.independentVariationFields === undefined) {
      const err = 'independentVariationFields is undefined, did you forget to' +
        ' embed it?';
      throw new Error(err);
    }
    const iVF: VariationField[] =
      _.orderBy(this.independentVariationFields, ['position'], ['asc']);
    return iVF.map(field => field.buildEmptyVariation());
  };

  public buildEmptyVariationGroup = () => {
    if (this.groupVariationFields === undefined) {
      const err = 'groupVariationFields is undefined, did you forget to embed' +
        ' it?';
      throw new Error(err);
    }
    const result = new this.merchi.VariationsGroup();
    const variations = [];
    let cost = 0;
    const sortedFields = _.orderBy(
      this.groupVariationFields, ['position'], ['asc']);
    result.quantity = 0;
    for (const variationField of sortedFields) {
      const empty = variationField.buildEmptyVariation();
      variations.push(empty);
      cost += empty.cost as number;
    }
    result.groupCost = cost;
    result.variations = variations;
    return result;
  };

  public removeVariationField = (variationField: VariationField) => {
    if (variationField.independent === undefined) {
      throw new Error('variation.independent is undefined, did you ' +
                      'forget to embed it?');
    }
    if (this.independentVariationFields === undefined) {
      const err = 'independentVariationFields is undefined, did you forget to' +
        ' embed it?';
      throw new Error(err);
    }
    if (this.groupVariationFields === undefined) {
      const err = 'groupVariationFields is undefined, did you forget to embed' +
        ' it?';
      throw new Error(err);
    }
    const variationFields = variationField.independent ?
      this.independentVariationFields : this.groupVariationFields;
    const index = variationFields.findIndex(v => {
      if (v.id === undefined) {
        throw new Error('variation id is undefined, did you forget to ' +
          'embed it?');
      }
      return v.id === variationField.id;
    });
    return variationFields.splice(index, 1);
  };
}
