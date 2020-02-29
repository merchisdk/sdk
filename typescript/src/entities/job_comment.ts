import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { Notification } from './notification';
import { User } from './user';

export class JobComment extends Entity {
  protected static resourceName: string = 'job_comments';
  protected static singularName: string = 'jobComment';
  protected static pluralName: string = 'jobComments';

  @JobComment.property({type: Date})
  public archived?: Date | null;

  @JobComment.property()
  public id?: number;

  @JobComment.property({type: Date})
  public date?: Date | null;

  @JobComment.property()
  public text?: string;

  @JobComment.property()
  public sendSms?: boolean;

  @JobComment.property()
  public sendEmail?: boolean;

  @JobComment.property()
  public urgency?: number;

  @JobComment.property({type: Date})
  public file?: MerchiFile | null;

  @JobComment.property({arrayType: 'User'})
  public forwards?: User[];

  @JobComment.property({arrayType: 'Notification'})
  public notifications?: Notification[];

  @JobComment.property()
  public job?: Job;

  @JobComment.property()
  public user?: User;
}
