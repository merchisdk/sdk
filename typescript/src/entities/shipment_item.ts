import { Entity } from '../entity';
import { ShipmentItemFulfillment } from './shipment_item_fulfillment';
import { Job } from './job';

export class ShipmentItem extends Entity {
  protected static resourceName: string = 'shipment_items';
  protected static singularName: string = 'shipmentItem';
  protected static pluralName: string = 'shipmentItems';

  @ShipmentItem.property({type: Job})
  public job?: Job;

  @ShipmentItem.property({arrayType: 'ShipmentItemFulfillment'})
  public fulfillments?: ShipmentItemFulfillment[];
}
