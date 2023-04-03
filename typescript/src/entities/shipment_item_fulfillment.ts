import { Entity } from '../entity';
import { Assignment } from './assignment';
import { Job } from './job';

export class ShipmentItemFulfillment extends Entity {
  protected static resourceName = 'shipment_item_fulfillments';
  protected static singularName = 'shipmentItemFulfillment';
  protected static pluralName = 'shipmentItemFulfillments';

  @ShipmentItemFulfillment.property({type: 'Assignment'})
  public assignment?: Assignment;

  @ShipmentItemFulfillment.property({type: 'Job'})
  public job?: Job;
}
