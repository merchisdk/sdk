import { ShipmentMethod } from './shipment_method';
import { Entity } from '../entity';

export class CartShipmentQuote extends Entity {
  protected static resourceName: string = 'cart_shipment_quotes';
  protected static singularName: string = 'cartShipmentQuote';
  protected static pluralName: string = 'cartShipmentQuotes';

  @CartShipmentQuote.property()
  public id?: number;

  @CartShipmentQuote.property()
  public subtotalCost?: number;

  @CartShipmentQuote.property()
  public taxAmount?: number;

  @CartShipmentQuote.property()
  public totalCost?: number;

  @CartShipmentQuote.property({type: 'ShipmentMethod'})
  public shipmentMethod?: ShipmentMethod;
}
