import { Address } from './address';
import { CartItem } from './cart_item';
import { Company } from './company';
import { Domain } from './domain';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { User } from './user';

export class Cart extends Entity {
  protected static resourceName: string = 'carts';
  protected static singularName: string = 'cart';
  protected static pluralName: string = 'carts';

  @Cart.property({type: Date})
  public archived?: Date | null;

  @Cart.property()
  public id?: number;

  @Cart.property()
  public creationDate?: Date;

  @Cart.property({type: Date})
  public ip?: string | null;

  @Cart.property({type: String})
  public token?: string | null;

  @Cart.property({type: String})
  public receiverNotes?: string | null;

  @Cart.property()
  public currency?: number;

  @Cart.property()
  public cartItemsSubtotalCost?: number;

  @Cart.property()
  public cartItemsTaxAmount?: number;

  @Cart.property()
  public cartItemsTotalCost?: number;

  @Cart.property()
  public subtotalCost?: number;

  @Cart.property()
  public taxAmount?: number;

  @Cart.property()
  public totalCost?: number;

  @Cart.property({type: User})
  public client?: User | null;

  @Cart.property({type: Company})
  public clientCompany?: Company | null;

  @Cart.property()
  public domain?: Domain;

  @Cart.property({type: 'Invoice'})
  public invoice?: Invoice | null;

  @Cart.property({type: Address})
  public receiverAddress?: Address | null;

  @Cart.property({arrayType: 'CartItem'})
  public cartItems?: CartItem[];

  public requiresShipment = () => {
    if (this.cartItems === undefined) {
      throw 'cartItems is undefined, did you forget to embed it?';
    }
    for (const cartItem of this.cartItems) {
      if (cartItem.requiresShipment()) {
        return true;
      }
    }
    return false;
  }
}
