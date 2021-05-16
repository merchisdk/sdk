import { Assignment } from './assignment';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Notification } from './notification';
import { User } from './user';

export class ProductionComment extends Entity {
  protected static resourceName: string = 'production_comments';
  protected static singularName: string = 'productionComment';
  protected static pluralName: string = 'productionComments';

  @ProductionComment.property({type: Date})
  public archived?: Date | null;

  @ProductionComment.property()
  public id?: number;

  @ProductionComment.property({type: Date})
  public date?: Date | null;

  @ProductionComment.property()
  public urgency?: number;

  @ProductionComment.property()
  public text?: string;

  @ProductionComment.property()
  public isUrgentQuestion?: boolean;

  @ProductionComment.property()
  public sendSms?: boolean;

  @ProductionComment.property()
  public sendEmail?: boolean;

  @ProductionComment.property({type: MerchiFile})
  public file?: MerchiFile | null;

  @ProductionComment.property()
  public user?: User;

  @ProductionComment.property({arrayType: 'User'})
  public forwards?: User[];

  @ProductionComment.property({arrayType: 'Notification'})
  public notifications?: Notification[];

  @ProductionComment.property()
  public assignment?: Assignment;
}
