import { Bid } from './bid';
import { Entity } from '../entity';
import { Job } from './job';
import { Notification } from './notification';
import { ProductionComment } from './production_comment';
import { Shipment } from './shipment';
import { User } from './user';

export class Assignment extends Entity {
  protected static resourceName: string = "assignments";
  protected static singularName: string = "assignment";
  protected static pluralName: string = "assignments";

  @Assignment.property("archived")
  public archived?: Date | null;

  @Assignment.property("id")
  public id?: number;

  @Assignment.property("managerAccepts")
  public managerAccepts?: Date | null;

  @Assignment.property("supplierRefused")
  public supplierRefused?: Date | null;

  @Assignment.property("productionDeadline")
  public productionDeadline?: Date;

  @Assignment.property("assignmentDeadline")
  public assignmentDeadline?: Date;

  @Assignment.property("job")
  public job?: Job | null;

  @Assignment.property("supplyJob")
  public supplyJob?: Job | null;

  @Assignment.property("supplier")
  public supplier?: User | null;

  @Assignment.property("bid")
  public bid?: Bid | null;

  @Assignment.property("comments", "ProductionComment")
  public comments?: Array<ProductionComment>;

  @Assignment.property("shipment")
  public shipment?: Shipment | null;

  @Assignment.property("notifications", "Notification")
  public notifications?: Array<Notification>;
}
