import { Draft } from './draft';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { Notification } from './notification';
import { User } from './user';

export class DraftComment extends Entity {
  protected static resourceName: string = "draft_comments";
  protected static singularName: string = "draftComment";
  protected static pluralName: string = "draftComments";

  @DraftComment.property()
  public archived?: Date | null;

  @DraftComment.property()
  public id?: number;

  @DraftComment.property()
  public date?: Date | null;

  @DraftComment.property()
  public urgency?: number;

  @DraftComment.property()
  public text?: string;

  @DraftComment.property()
  public changeRequest?: boolean;

  @DraftComment.property()
  public sendSms?: boolean;

  @DraftComment.property()
  public sendEmail?: boolean;

  @DraftComment.property()
  public user?: User;

  @DraftComment.property()
  public file?: MerchiFile | null;

  @DraftComment.property("User")
  public forwards?: Array<User>;

  @DraftComment.property("Notification")
  public notifications?: Array<Notification>;

  @DraftComment.property()
  public draft?: Draft | null;

  @DraftComment.property()
  public job?: Job | null;
}
