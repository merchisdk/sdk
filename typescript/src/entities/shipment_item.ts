import { Entity } from '../entity';
import { Assignment } from './assignment';
import { Job } from './job';

export class ShipmentItem extends Entity {
  protected static resourceName: string = 'shipment_items';
  protected static singularName: string = 'shipmentItem';
  protected static pluralName: string = 'shipmentItems';

  @ShipmentItem.property({type: Job})
  public job?: Job | null;

  @ShipmentItem.property({arrayType: 'Job' | 'Assignment'})
  public fulfillments?: (Job | Assignment)[] | null;
}
