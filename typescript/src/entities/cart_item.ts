import { Cart } from './cart';
import { CountryTax } from './country_tax';
import { Entity } from '../entity';
import { Product } from './product';
import { Variation } from './variation';
import { VariationsGroup } from './variations_group';

export class CartItem extends Entity {
  protected static resourceName: string = "cart_items";
  protected static singularName: string = "cartItem";
  protected static pluralName: string = "cartItems";

  @CartItem.property()
  public archived?: Date | null;

  @CartItem.property()
  public id?: number;

  @CartItem.property()
  public quantity?: number;

  @CartItem.property()
  public notes?: string | null;

  @CartItem.property()
  public creationDate?: Date;

  @CartItem.property()
  public currency?: number;

  @CartItem.property()
  public subtotalCost?: number;

  @CartItem.property()
  public taxAmount?: number;

  @CartItem.property()
  public totalCost?: number;

  @CartItem.property()
  public product?: Product;

  @CartItem.property()
  public cart?: Cart;

  @CartItem.property(undefined, {embeddedByDefault: false})
  public taxType?: CountryTax;

  @CartItem.property("VariationsGroup")
  public variationsGroups?: Array<VariationsGroup>;

  @CartItem.property("Variation")
  public variations?: Array<Variation>;
}
