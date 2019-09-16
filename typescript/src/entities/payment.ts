import { Entity } from '../entity';
import { Invoice } from './invoice';
import { User } from './user';

export class Payment extends Entity {
  protected static resourceName: string = "payments";
  protected static singularName: string = "payment";
  protected static pluralName: string = "payments";

  @Payment.property()
  public archived?: Date | null;

  @Payment.property()
  public id?: number;

  @Payment.property()
  public payDate?: Date;

  @Payment.property()
  public paymentType?: number;

  @Payment.property()
  public note?: string;

  @Payment.property()
  public amount?: number;

  @Payment.property()
  public sendSms?: boolean;

  @Payment.property()
  public sendEmail?: boolean;

  @Payment.property()
  public invoice?: Invoice | null;

  @Payment.property()
  public paymentRecorder?: User | null;
}
