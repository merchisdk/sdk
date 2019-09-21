import { Assignment } from './assignment';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Notification } from './notification';
import { User } from './user';

export class ProductionComment extends Entity {
  protected static resourceName: string = "production_comments";
  protected static singularName: string = "productionComment";
  protected static pluralName: string = "productionComments";

  @ProductionComment.property()
  public archived?: Date | null;

  @ProductionComment.property()
  public id?: number;

  @ProductionComment.property()
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

  @ProductionComment.property()
  public file?: MerchiFile | null;

  @ProductionComment.property()
  public user?: User;

  @ProductionComment.property({arrayType: "User"})
  public forwards?: Array<User>;

  @ProductionComment.property({arrayType: "Notification"})
  public notifications?: Array<Notification>;

  @ProductionComment.property()
  public assignment?: Assignment;
}
