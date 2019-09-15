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

  @Product.property("archived")
  public archived?: Date | null;

  @Product.property("id")
  public id?: number;

  @Product.property("productType")
  public productType?: number;

  @Product.property("minimum")
  public minimum?: number;

  @Product.property("deliveryDaysNormal")
  public deliveryDaysNormal?: number;

  @Product.property("unitPrice")
  public unitPrice?: number;

  @Product.property("unitWeight")
  public unitWeight?: number | null;

  @Product.property("unitHeight")
  public unitHeight?: number | null;

  @Product.property("unitWidth")
  public unitWidth?: number | null;

  @Product.property("unitDepth")
  public unitDepth?: number | null;

  @Product.property("name")
  public name?: string;

  @Product.property("description")
  public description?: string | null;

  @Product.property("notes")
  public notes?: string | null;

  @Product.property("needsDrafting")
  public needsDrafting?: boolean;

  @Product.property("needsProduction")
  public needsProduction?: boolean;

  @Product.property("needsShipping")
  public needsShipping?: boolean;

  @Product.property("showPublic")
  public showPublic?: boolean;

  @Product.property("acceptStripe")
  public acceptStripe?: boolean;

  @Product.property("acceptPaypal")
  public acceptPaypal?: boolean;

  @Product.property("acceptBankTransfer")
  public acceptBankTransfer?: boolean;

  @Product.property("acceptPhonePayment")
  public acceptPhonePayment?: boolean;

  @Product.property("allowPaymentUpfront")
  public allowPaymentUpfront?: boolean;

  @Product.property("allowQuotation")
  public allowQuotation?: boolean;

  @Product.property("bestPrice")
  public bestPrice?: number;

  @Product.property("unitVolume")
  public unitVolume?: number;

  @Product.property("categories", "Category")
  public categories?: Array<Category>;

  @Product.property("discounts", "Discount")
  public discounts?: Array<Discount>;

  @Product.property("domain")
  public domain?: Domain;

  @Product.property("images", "MerchiFile")
  public images?: Array<MerchiFile>;

  @Product.property("groupVariationFields", "VariationField")
  public groupVariationFields?: Array<VariationField>;

  @Product.property("independentVariationFields", "VariationField")
  public independentVariationFields?: Array<VariationField>;

  @Product.property("tags", "DomainTag")
  public tags?: Array<DomainTag>;

  @Product.property("featureImage")
  public featureImage?: MerchiFile | null;

  @Product.property("saved_by_companies", "Company")
  public saved_by_companies?: Array<Company>;

  @Product.property("suppliedByDomains", "SupplyDomain")
  public suppliedByDomains?: Array<SupplyDomain>;

  @Product.property("supplyDomains", "SupplyDomain")
  public supplyDomains?: Array<SupplyDomain>;

  @Product.property("inventories", "Inventory")
  public inventories?: Array<Inventory>;

  @Product.property("cartItems", "CartItem")
  public cartItems?: Array<CartItem>;

  @Product.property("jobs", "Job")
  public jobs?: Array<Job>;

  @Product.property("saved_by_users", "User")
  public saved_by_users?: Array<User>;

  @Product.property("suppliers", "User")
  public suppliers?: Array<User>;
}
