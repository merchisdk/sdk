import { Draft } from './draft';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { Notification } from './notification';
import { User } from './user';

export class DraftComment extends Entity {
  protected static resourceName: string = 'draft_comments';
  protected static singularName: string = 'draftComment';
  protected static pluralName: string = 'draftComments';

  @DraftComment.property({type: Date})
  public archived?: Date | null;

  @DraftComment.property()
  public id?: number;

  @DraftComment.property({type: Date})
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

  @DraftComment.property({type: MerchiFile})
  public file?: MerchiFile | null;

  @DraftComment.property({arrayType: 'User'})
  public forwards?: User[];

  @DraftComment.property({arrayType: 'Notification'})
  public notifications?: Notification[];

  @DraftComment.property({type: Draft})
  public draft?: Draft | null;

  @DraftComment.property({type: Job})
  public job?: Job | null;
}
