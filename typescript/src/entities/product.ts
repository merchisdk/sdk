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
}
