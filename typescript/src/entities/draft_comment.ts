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

  @DraftComment.property("archived")
  public archived?: Date | null;

  @DraftComment.property("id")
  public id?: number;

  @DraftComment.property("date")
  public date?: Date | null;

  @DraftComment.property("urgency")
  public urgency?: number;

  @DraftComment.property("text")
  public text?: string;

  @DraftComment.property("changeRequest")
  public changeRequest?: boolean;

  @DraftComment.property("sendSms")
  public sendSms?: boolean;

  @DraftComment.property("sendEmail")
  public sendEmail?: boolean;

  @DraftComment.property("user")
  public user?: User;

  @DraftComment.property("file")
  public file?: MerchiFile | null;

  @DraftComment.property("forwards", "User")
  public forwards?: Array<User>;

  @DraftComment.property("notifications", "Notification")
  public notifications?: Array<Notification>;

  @DraftComment.property("draft")
  public draft?: Draft | null;

  @DraftComment.property("job")
  public job?: Job | null;
}
