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

  @Draft.property()
  public archived?: Date | null;

  @Draft.property()
  public id?: number;

  @Draft.property()
  public date?: Date | null;

  @Draft.property()
  public accepted?: Date | null;

  @Draft.property()
  public resendDate?: Date | null;

  @Draft.property()
  public viewed?: boolean | null;

  @Draft.property()
  public sendSms?: boolean;

  @Draft.property()
  public sendEmail?: boolean;

  @Draft.property({arrayType: "DraftComment"})
  public comments?: Array<DraftComment>;

  @Draft.property()
  public designer?: User;

  @Draft.property()
  public file?: MerchiFile;

  @Draft.property({arrayType: "Notification"})
  public notification?: Array<Notification>;

  @Draft.property()
  public job?: Job;
}
