import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { Notification } from './notification';
import { User } from './user';

export class JobComment extends Entity {
  protected static resourceName: string = "job_comments";
  protected static singularName: string = "jobComment";
  protected static pluralName: string = "jobComments";

  @JobComment.property()
  public archived?: Date | null;

  @JobComment.property()
  public id?: number;

  @JobComment.property()
  public date?: Date | null;

  @JobComment.property()
  public text?: string;

  @JobComment.property()
  public sendSms?: boolean;

  @JobComment.property()
  public sendEmail?: boolean;

  @JobComment.property()
  public urgency?: number;

  @JobComment.property()
  public file?: MerchiFile | null;

  @JobComment.property("User")
  public forwards?: Array<User>;

  @JobComment.property("Notification")
  public notifications?: Array<Notification>;

  @JobComment.property()
  public job?: Job;

  @JobComment.property()
  public user?: User;
}
