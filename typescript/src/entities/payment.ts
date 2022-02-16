import { Entity } from '../entity';
import { Invoice } from './invoice';
import { User } from './user';
import { AutomaticPaymentRelationship } from './automatic_payment_relationship';

export class Payment extends Entity {
  protected static resourceName: string = 'payments';
  protected static singularName: string = 'payment';
  protected static pluralName: string = 'payments';

  @Payment.property({type: Date})
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
  public autoRefundable?: boolean;

  @Payment.property({type: Date})
  public refunded?: Date | null;

  @Payment.property()
  public sendSms?: boolean;

  @Payment.property()
  public sendEmail?: boolean;

  @Payment.property({type: Invoice})
  public invoice?: Invoice | null;

  @Payment.property({type: User})
  public paymentRecorder?: User | null;

  @Payment.property({type: User})
  public refundIssuer?: User | null;

  @Payment.property({type: AutomaticPaymentRelationship})
  public chargedByPaymentRelationship?: AutomaticPaymentRelationship | null;
}
