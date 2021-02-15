import { DraftComment } from './draft_comment';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { Notification } from './notification';
import { User } from './user';

export class Draft extends Entity {
  protected static resourceName: string = 'drafts';
  protected static singularName: string = 'draft';
  protected static pluralName: string = 'drafts';

  @Draft.property({type: Date})
  public archived?: Date | null;

  @Draft.property()
  public id?: number;

  @Draft.property({type: Date})
  public date?: Date | null;

  @Draft.property({type: Date})
  public accepted?: Date | null;

  @Draft.property({type: Date})
  public resendDate?: Date | null;

  @Draft.property()
  public viewed?: boolean;

  @Draft.property()
  public sendSms?: boolean;

  @Draft.property()
  public sendEmail?: boolean;

  @Draft.property({arrayType: 'DraftComment'})
  public comments?: DraftComment[];

  @Draft.property()
  public designer?: User;

  @Draft.property()
  public file?: MerchiFile;

  @Draft.property({arrayType: 'Notification'})
  public notification?: Notification[];

  @Draft.property()
  public job?: Job;

  public wereChangesRequested = () => {
    /* true if any comment is/was a change request comment. */
    if (this.comments === undefined) {
      throw 'comments is undefined. did you forget to embed it?';
    }
    for (const comment of this.comments) {
      if (comment.changeRequest === undefined) {
        throw 'changeRequest is undefined.';
      }
      if (comment.changeRequest) {
        return true;
      }
    }
    return false;
  }

  public commentsYoungestToEldest = () => {
    if (this.comments === undefined) {
      throw 'comments is undefined. did you forget to embed it?';
    }
    return this.comments.sort((a, b) => {
      if (a.id === undefined || b.id === undefined) {
        throw 'comment id is undefined. did you forget to embed it?';
      }
      return a.id - b.id;
    });
  }
}
