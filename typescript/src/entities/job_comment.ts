import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { Notification } from './notification';
import { User } from './user';

export class JobComment extends Entity {
  protected static resourceName: string = "job_comments";
  protected static singularName: string = "jobComment";
  protected static pluralName: string = "jobComments";

  @JobComment.property("archived")
  public archived?: Date | null;

  @JobComment.property("id")
  public id?: number;

  @JobComment.property("date")
  public date?: Date | null;

  @JobComment.property("text")
  public text?: string;

  @JobComment.property("sendSms")
  public sendSms?: boolean;

  @JobComment.property("sendEmail")
  public sendEmail?: boolean;

  @JobComment.property("urgency")
  public urgency?: number;

  @JobComment.property("file")
  public file?: MerchiFile | null;

  @JobComment.property("forwards", "User")
  public forwards?: Array<User>;

  @JobComment.property("notifications", "Notification")
  public notifications?: Array<Notification>;

  @JobComment.property("job")
  public job?: Job;

  @JobComment.property("user")
  public user?: User;
}
