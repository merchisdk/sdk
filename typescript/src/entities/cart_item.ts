import { Cart } from './cart';
import { Entity } from '../entity';
import { Product } from './product';
import { Variation } from './variation';
import { VariationsGroup } from './variations_group';

export class CartItem extends Entity {
  protected static resourceName: string = "cart_items";
  protected static singularName: string = "cartItem";
  protected static pluralName: string = "cartItems";

  @CartItem.property("archived")
  public archived?: Date | null;

  @CartItem.property("id")
  public id?: number;

  @CartItem.property("quantity")
  public quantity?: number;

  @CartItem.property("notes")
  public notes?: string | null;

  @CartItem.property("creationDate")
  public creationDate?: Date;

  @CartItem.property("currency")
  public currency?: number;

  @CartItem.property("subtotalCost")
  public subtotalCost?: number;

  @CartItem.property("taxAmount")
  public taxAmount?: number;

  @CartItem.property("totalCost")
  public totalCost?: number;

  @CartItem.property("product")
  public product?: Product;

  @CartItem.property("cart")
  public cart?: Cart;

  @CartItem.property("variationsGroups", "VariationsGroup")
  public variationsGroups?: Array<VariationsGroup>;

  @CartItem.property("variations", "Variation")
  public variations?: Array<Variation>;
}
