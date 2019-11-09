import { Assignment } from './assignment';
import { Domain } from './domain';
import { Draft } from './draft';
import { DraftComment } from './draft_comment';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Invoice } from './invoice';
import { Job } from './job';
import { JobComment } from './job_comment';
import { ProductionComment } from './production_comment';
import { ShortUrl } from './short_url';
import { User } from './user';

export class Notification extends Entity {
  protected static resourceName: string = 'notifications';
  protected static singularName: string = 'notification';
  protected static pluralName: string = 'notifications';

  @Notification.property()
  public archived?: Date | null;

  @Notification.property()
  public id?: number;

  @Notification.property()
  public notificationType?: number;

  @Notification.property()
  public date?: Date;

  @Notification.property()
  public seen?: boolean;

  @Notification.property()
  public sendEmail?: boolean;

  @Notification.property()
  public sendSms?: boolean;

  @Notification.property()
  public urgency?: number;

  @Notification.property()
  public description?: string | null;

  @Notification.property()
  public subject?: string | null;

  @Notification.property()
  public message?: string;

  @Notification.property()
  public htmlMessage?: string;

  @Notification.property()
  public link?: string | null;

  @Notification.property()
  public section?: number;

  @Notification.property()
  public shortUrl?: ShortUrl | null;

  @Notification.property()
  public recipient?: User;

  @Notification.property()
  public sender?: User | null;

  @Notification.property()
  public relatedJob?: Job | null;

  @Notification.property()
  public relatedDraft?: Draft | null;

  @Notification.property()
  public relatedAssignment?: Assignment | null;

  @Notification.property()
  public relatedInvoice?: Invoice | null;

  @Notification.property()
  public relatedJobComment?: JobComment | null;

  @Notification.property()
  public relatedDraftComment?: DraftComment | null;

  @Notification.property()
  public relatedProductionComment?: ProductionComment | null;

  @Notification.property()
  public domain?: Domain;

  @Notification.property()
  public attachment?: MerchiFile | null;
}
