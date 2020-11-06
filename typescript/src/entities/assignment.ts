import { Quote } from './quote';
import { Entity } from '../entity';
import { Job } from './job';
import { Notification } from './notification';
import { ProductionComment } from './production_comment';
import { Shipment } from './shipment';
import { SupplyDomain } from './supply_domain';
import { User } from './user';

export class Assignment extends Entity {
  protected static resourceName: string = 'assignments';
  protected static singularName: string = 'assignment';
  protected static pluralName: string = 'assignments';

  @Assignment.property({type: Date})
  public archived?: Date | null;

  @Assignment.property()
  public id?: number;

  @Assignment.property({type: Date})
  public managerAccepts?: Date | null;

  @Assignment.property({type: Date})
  public supplierRefused?: Date | null;

  @Assignment.property()
  public productionDeadline?: Date;

  @Assignment.property()
  public assignmentDeadline?: Date;

  @Assignment.property({type: 'Job'})
  public job?: Job | null;

  @Assignment.property({type: 'Job'})
  public supplyJob?: Job | null;

  @Assignment.property({type: User})
  public supplier?: User | null;

  @Assignment.property({type: Quote})
  public quote?: Quote | null;

  @Assignment.property({arrayType: 'ProductionComment'})
  public comments?: ProductionComment[];

  @Assignment.property({type: Shipment})
  public shipment?: Shipment | null;

  @Assignment.property({type: SupplyDomain})
  public supplyDomain?: SupplyDomain | null;

  @Assignment.property({arrayType: 'Notification'})
  public notifications?: Notification[];
}
