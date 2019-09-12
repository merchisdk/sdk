import { Entity } from '../entity';
import { Invoice } from './invoice';
import { User } from './user';

export class Payment extends Entity {
  protected static resourceName: string = "payments";
  protected static singularName: string = "payment";
  protected static pluralName: string = "payments";

  @Payment.property("archived")
  public archived?: Date | null;

  @Payment.property("id")
  public id?: number;

  @Payment.property("payDate")
  public payDate?: Date;

  @Payment.property("paymentType")
  public paymentType?: number;

  @Payment.property("note")
  public note?: string;

  @Payment.property("amount")
  public amount?: number;

  @Payment.property("sendSms")
  public sendSms?: boolean;

  @Payment.property("sendEmail")
  public sendEmail?: boolean;

  @Payment.property("invoice")
  public invoice?: Invoice | null;

  @Payment.property("paymentRecorder")
  public paymentRecorder?: User | null;
}
