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

  @Assignment.property()
  public archived?: Date | null;

  @Assignment.property()
  public id?: number;

  @Assignment.property()
  public managerAccepts?: Date | null;

  @Assignment.property()
  public supplierRefused?: Date | null;

  @Assignment.property()
  public productionDeadline?: Date;

  @Assignment.property()
  public assignmentDeadline?: Date;

  @Assignment.property()
  public job?: Job | null;

  @Assignment.property()
  public supplyJob?: Job | null;

  @Assignment.property()
  public supplier?: User | null;

  @Assignment.property()
  public bid?: Bid | null;

  @Assignment.property("ProductionComment")
  public comments?: Array<ProductionComment>;

  @Assignment.property()
  public shipment?: Shipment | null;

  @Assignment.property("Notification")
  public notifications?: Array<Notification>;
}
