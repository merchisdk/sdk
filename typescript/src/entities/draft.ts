import { DraftComment } from './draft_comment';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { Notification } from './notification';
import { User } from './user';

export class Draft extends Entity {
  protected static resourceName: string = "drafts";
  protected static singularName: string = "draft";
  protected static pluralName: string = "drafts";

  @Draft.property("archived")
  public archived?: Date | null;

  @Draft.property("id")
  public id?: number;

  @Draft.property("date")
  public date?: Date | null;

  @Draft.property("accepted")
  public accepted?: Date | null;

  @Draft.property("resendDate")
  public resendDate?: Date | null;

  @Draft.property("viewed")
  public viewed?: boolean | null;

  @Draft.property("sendSms")
  public sendSms?: boolean;

  @Draft.property("sendEmail")
  public sendEmail?: boolean;

  @Draft.property("comments", "DraftComment")
  public comments?: Array<DraftComment>;

  @Draft.property("designer")
  public designer?: User;

  @Draft.property("file")
  public file?: MerchiFile;

  @Draft.property("notification", "Notification")
  public notification?: Array<Notification>;

  @Draft.property("job")
  public job?: Job;
}
