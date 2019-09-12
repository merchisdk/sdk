import { Assignment } from './assignment';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Notification } from './notification';
import { User } from './user';

export class ProductionComment extends Entity {
  protected static resourceName: string = "production_comments";
  protected static singularName: string = "productionComment";
  protected static pluralName: string = "productionComments";

  @ProductionComment.property("archived")
  public archived?: Date | null;

  @ProductionComment.property("id")
  public id?: number;

  @ProductionComment.property("date")
  public date?: Date | null;

  @ProductionComment.property("urgency")
  public urgency?: number;

  @ProductionComment.property("text")
  public text?: string;

  @ProductionComment.property("isUrgentQuestion")
  public isUrgentQuestion?: boolean;

  @ProductionComment.property("sendSms")
  public sendSms?: boolean;

  @ProductionComment.property("sendEmail")
  public sendEmail?: boolean;

  @ProductionComment.property("file")
  public file?: MerchiFile | null;

  @ProductionComment.property("user")
  public user?: User;

  @ProductionComment.property("forwards", "User")
  public forwards?: Array<User>;

  @ProductionComment.property("notifications", "Notification")
  public notifications?: Array<Notification>;

  @ProductionComment.property("assignment")
  public assignment?: Assignment;
}
