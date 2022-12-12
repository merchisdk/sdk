import { Entity } from '../entity';
import { Assignment } from './assignment';
import { Job } from './job';

export class ShipmentItemFulfillment extends Entity {
  protected static resourceName: string = 'shipment_item_fulfillments';
  protected static singularName: string = 'shipmentItemFulfillment';
  protected static pluralName: string = 'shipmentItemFulfillments';

  @ShipmentItemFulfillment.property({type: 'Assignment'})
  public assignment?: Assignment | null;

  @ShipmentItemFulfillment.property({type: 'Job'})
  public job?: Job | null;
}
