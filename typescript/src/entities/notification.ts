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
  protected static resourceName: string = "notifications";
  protected static singularName: string = "notification";
  protected static pluralName: string = "notifications";

  @Notification.property("archived")
  public archived?: Date | null;

  @Notification.property("id")
  public id?: number;

  @Notification.property("notificationType")
  public notificationType?: number;

  @Notification.property("date")
  public date?: Date;

  @Notification.property("seen")
  public seen?: boolean;

  @Notification.property("sendEmail")
  public sendEmail?: boolean;

  @Notification.property("sendSms")
  public sendSms?: boolean;

  @Notification.property("urgency")
  public urgency?: number;

  @Notification.property("description")
  public description?: string | null;

  @Notification.property("subject")
  public subject?: string | null;

  @Notification.property("message")
  public message?: string;

  @Notification.property("htmlMessage")
  public htmlMessage?: string;

  @Notification.property("link")
  public link?: string | null;

  @Notification.property("section")
  public section?: number;

  @Notification.property("shortUrl")
  public shortUrl?: ShortUrl | null;

  @Notification.property("recipient")
  public recipient?: User;

  @Notification.property("sender")
  public sender?: User | null;

  @Notification.property("relatedJob")
  public relatedJob?: Job | null;

  @Notification.property("relatedDraft")
  public relatedDraft?: Draft | null;

  @Notification.property("relatedAssignment")
  public relatedAssignment?: Assignment | null;

  @Notification.property("relatedInvoice")
  public relatedInvoice?: Invoice | null;

  @Notification.property("relatedJobComment")
  public relatedJobComment?: JobComment | null;

  @Notification.property("relatedDraftComment")
  public relatedDraftComment?: DraftComment | null;

  @Notification.property("relatedProductionComment")
  public relatedProductionComment?: ProductionComment | null;

  @Notification.property("domain")
  public domain?: Domain;

  @Notification.property("attachment")
  public attachment?: MerchiFile | null;
}
