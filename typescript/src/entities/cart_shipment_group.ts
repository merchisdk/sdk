import { CartItem } from './cart_item';
import { CartShipmentQuote } from './cart_shipment_quote';
import { Entity } from '../entity';

export class CartShipmentGroup extends Entity {
  protected static resourceName: string = 'cart_shipment_groups';
  protected static singularName: string = 'cartShipmentGroup';
  protected static pluralName: string = 'cartShipmentGroups';

  @CartShipmentGroup.property()
  public id?: number;

  @CartShipmentGroup.property({arrayType: 'CartItem'})
  public cartItems?: CartItem[];

  @CartShipmentGroup.property({arrayType: 'CartShipmentQuote'})
  public quotes?: CartShipmentQuote[];

  @CartShipmentGroup.property({arrayType: 'CartShipmentQuote'})
  public selectedQuote?: CartShipmentQuote[];
}
