import { ShipmentMethod } from './shipment_method';
import { Entity } from '../entity';
import { ShipmentService } from '../constants/shipment_services';

export class CartShipmentQuote extends Entity {
  protected static resourceName = 'cart_shipment_quotes';
  protected static singularName = 'cartShipmentQuote';
  protected static pluralName = 'cartShipmentQuotes';

  @CartShipmentQuote.property()
  public id?: number;

  @CartShipmentQuote.property()
  public name?: string;

  @CartShipmentQuote.property()
  public subtotalCost?: number;

  @CartShipmentQuote.property()
  public taxAmount?: number;

  @CartShipmentQuote.property()
  public totalCost?: number;

  @CartShipmentQuote.property({type: ShipmentService})
  public shipmentService?: ShipmentService | null;

  @CartShipmentQuote.property()
  public shipmentServiceQuote?: string;

  @CartShipmentQuote.property({type: 'ShipmentMethod'})
  public shipmentMethod?: ShipmentMethod;
}
