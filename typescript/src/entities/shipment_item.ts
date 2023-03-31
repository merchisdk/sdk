import { Entity } from '../entity';
import { Job } from './job';
import { ShipmentItemFulfillment } from './shipment_item_fulfillment';

export class ShipmentItem extends Entity {
  protected static resourceName = 'shipment_items';
  protected static singularName = 'shipmentItem';
  protected static pluralName = 'shipmentItems';

  @ShipmentItem.property({type: Job})
  public job?: Job;

  @ShipmentItem.property({arrayType: 'ShipmentItemFulfillment'})
  public fulfillments?: ShipmentItemFulfillment[];
}
