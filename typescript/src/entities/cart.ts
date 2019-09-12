import { Address } from './address';
import { CartItem } from './cart_item';
import { Company } from './company';
import { Domain } from './domain';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { User } from './user';

export class Cart extends Entity {
  protected static resourceName: string = "carts";
  protected static singularName: string = "cart";
  protected static pluralName: string = "carts";

  @Cart.property("archived")
  public archived?: Date | null;

  @Cart.property("id")
  public id?: number;

  @Cart.property("creationDate")
  public creationDate?: Date;

  @Cart.property("ip")
  public ip?: string | null;

  @Cart.property("token")
  public token?: string | null;

  @Cart.property("receiverNotes")
  public receiverNotes?: string | null;

  @Cart.property("client")
  public client?: User | null;

  @Cart.property("clientCompany")
  public clientCompany?: Company | null;

  @Cart.property("domain")
  public domain?: Domain;

  @Cart.property("invoice")
  public invoice?: Invoice | null;

  @Cart.property("receiverAddress")
  public receiverAddress?: Address | null;

  @Cart.property("cartItems", "CartItem")
  public cartItems?: Array<CartItem>;
}
