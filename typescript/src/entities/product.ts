import { CartItem } from './cart_item';
import { Category } from './category';
import { Company } from './company';
import { Discount } from './discount';
import { Domain } from './domain';
import { DomainTag } from './domain_tag';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Inventory } from './inventory';
import { Job } from './job';
import { SupplyDomain } from './supply_domain';
import { User } from './user';
import { VariationField } from './variation_field';

export class Product extends Entity {
  protected static resourceName: string = "products";
  protected static singularName: string = "product";
  protected static pluralName: string = "products";

  @Product.property()
  public archived?: Date | null;

  @Product.property()
  public id?: number;

  @Product.property()
  public productType?: number;

  @Product.property()
  public minimum?: number;

  @Product.property()
  public deliveryDaysNormal?: number;

  @Product.property()
  public unitPrice?: number;

  @Product.property()
  public unitWeight?: number | null;

  @Product.property()
  public unitHeight?: number | null;

  @Product.property()
  public unitWidth?: number | null;

  @Product.property()
  public unitDepth?: number | null;

  @Product.property()
  public name?: string;

  @Product.property()
  public description?: string | null;

  @Product.property()
  public notes?: string | null;

  @Product.property()
  public needsDrafting?: boolean;

  @Product.property()
  public needsProduction?: boolean;

  @Product.property()
  public needsShipping?: boolean;

  @Product.property()
  public showPublic?: boolean;

  @Product.property()
  public acceptStripe?: boolean;

  @Product.property()
  public acceptPaypal?: boolean;

  @Product.property()
  public acceptBankTransfer?: boolean;

  @Product.property()
  public acceptPhonePayment?: boolean;

  @Product.property()
  public allowPaymentUpfront?: boolean;

  @Product.property()
  public allowQuotation?: boolean;

  @Product.property()
  public bestPrice?: number;

  @Product.property()
  public unitVolume?: number;

  @Product.property({arrayType: "Category"})
  public categories?: Array<Category>;

  @Product.property({arrayType: "Discount"})
  public discounts?: Array<Discount>;

  @Product.property()
  public domain?: Domain;

  @Product.property({arrayType: "MerchiFile"})
  public images?: Array<MerchiFile>;

  @Product.property({arrayType: "VariationField"})
  public groupVariationFields?: Array<VariationField>;

  @Product.property({arrayType: "VariationField"})
  public independentVariationFields?: Array<VariationField>;

  @Product.property({arrayType: "DomainTag"})
  public tags?: Array<DomainTag>;

  @Product.property()
  public featureImage?: MerchiFile | null;

  @Product.property({arrayType: "Company", jsonName: "saved_by_companies"})
  public savedByCompanies?: Array<Company>;

  @Product.property({arrayType: "SupplyDomain"})
  public suppliedByDomains?: Array<SupplyDomain>;

  @Product.property({arrayType: "SupplyDomain"})
  public supplyDomains?: Array<SupplyDomain>;

  @Product.property({arrayType: "Inventory"})
  public inventories?: Array<Inventory>;

  @Product.property({arrayType: "CartItem"})
  public cartItems?: Array<CartItem>;

  @Product.property({arrayType: "Job"})
  public jobs?: Array<Job>;

  @Product.property({arrayType: "User", jsonName: "saved_by_users"})
  public savedByUsers?: Array<User>;

  @Product.property({arrayType: "User"})
  public suppliers?: Array<User>;

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
  }

  public primaryImage = () => {
    if (this.featureImage === undefined) {
      throw new Error("featureImage is undefined, did you forget to embed it?");
    }
    if (this.images === undefined) {
      throw new Error("images is undefined, did you forget to embed it?");
    }
    if (this.featureImage !== null) {
      return this.featureImage;
    }
    if (this.images.length > 0) {
      return this.images[0];
    }
    return null;
  }

  public currency = () => {
    if (this.domain === undefined) {
      throw new Error("domain is undefined, did you forget to embed it?");
    }
    return this.domain.defaultCurrency();
  }

  public hasGroupVariationFields = () => {
    if (this.groupVariationFields === undefined) {
      const err = "groupVariationFields is undefined, did you forget to embed" +
        " it?";
      throw new Error(err);
    }
    return this.groupVariationFields.length > 0;
  }

  public hasIndependentVariationFields = () => {
    if (this.independentVariationFields === undefined) {
      const err = "independentVariationFields is undefined, did you forget to" +
        " embed it?";
      throw new Error(err);
    }
    return this.independentVariationFields.length > 0;
  }

  public taxType = () => {
    if (this.domain === undefined) {
      throw new Error("domain is undefined, did you forget to embed it?");
    }
    return this.domain.defaultTaxType();
  }

  public allVariationFields = () => {
    if (this.groupVariationFields === undefined) {
      const err = "groupVariationFields is undefined, did you forget to embed" +
        " it?";
      throw new Error(err);
    }
    if (this.independentVariationFields === undefined) {
      const err = "independentVariationFields is undefined, did you forget to" +
        " embed it?";
      throw new Error(err);
    }
    const result: Array<VariationField> = [];
    return result.concat(this.groupVariationFields,
                         this.independentVariationFields);
  }

  public buildEmptyVariations = () => {
    if (this.independentVariationFields === undefined) {
      const err = "independentVariationFields is undefined, did you forget to" +
        " embed it?";
      throw new Error(err);
    }
    return this.independentVariationFields.map(field =>
      field.buildEmptyVariation());
  }

  public buildEmptyVariationGroup = () => {
    if (this.groupVariationFields === undefined) {
      const err = "groupVariationFields is undefined, did you forget to embed" +
        " it?";
      throw new Error(err);
    }
    const result = new this.merchi.VariationsGroup();
    const variations = [];
    let cost = 0;
    result.quantity = 0;
    for (const variationField of this.groupVariationFields) {
      const empty = variationField.buildEmptyVariation(); 
      variations.push(empty);
      cost += empty.cost as number;
    }
    result.groupCost = cost;
    result.variations = variations;
    return result; 
  }

  public removeVariationField = (variationField: VariationField) => {
    if (variationField.independent === undefined) {
      throw new Error("variation.independent is undefined, did you " +
                      "forget to embed it?"); 
    }
    if (this.independentVariationFields === undefined) {
      const err = "independentVariationFields is undefined, did you forget to" +
        " embed it?";
      throw new Error(err);
    }
    if (this.groupVariationFields === undefined) {
      const err = "groupVariationFields is undefined, did you forget to embed" +
        " it?";
      throw new Error(err);
    }
    const variationFields = variationField.independent ?
      this.independentVariationFields : this.groupVariationFields;
    const index = variationFields.findIndex(v => {
      if (v.id === undefined) {
        throw new Error("variation id is undefined, did you forget to " +
          "embed it?");
      }
      return v.id === variationField.id;
    });
    return variationFields.splice(index, 1);
  }
}
