import { Address } from './address';
import { Cart } from './cart';
import { Company } from './company';
import { Domain } from './domain';
import { DomainTag } from './domain_tag';
import { EmailAddress } from './email_address';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Item } from './item';
import { Job } from './job';
import { Notification } from './notification';
import { Payment } from './payment';
import { PhoneNumber } from './phone_number';
import { Shipment } from './shipment';
import { User } from './user';

export class Invoice extends Entity {
  protected static resourceName: string = "invoices";
  protected static singularName: string = "invoice";
  protected static pluralName: string = "invoices";

  @Invoice.property()
  public archived?: Date | null;

  @Invoice.property()
  public id?: number;

  @Invoice.property()
  public creationDate?: Date | null;

  @Invoice.property()
  public paymentDeadline?: Date | null;

  @Invoice.property()
  public reminded?: Date | null;

  @Invoice.property()
  public reminderMessage?: string;

  @Invoice.property()
  public forceReminders?: boolean;

  @Invoice.property()
  public note?: string | null;

  @Invoice.property()
  public terms?: Date | null;

  @Invoice.property()
  public subtotalCost?: number | null;

  @Invoice.property()
  public taxAmount?: number | null;

  @Invoice.property()
  public totalCost?: number | null;

  @Invoice.property()
  public sendSms?: boolean | null;

  @Invoice.property()
  public sendEmail?: boolean | null;

  @Invoice.property()
  public unpaid?: boolean | null;

  @Invoice.property()
  public currency?: string;

  @Invoice.property()
  public acceptStripe?: boolean;

  @Invoice.property()
  public acceptPaypal?: boolean;

  @Invoice.property()
  public acceptBankTransfer?: boolean;

  @Invoice.property()
  public acceptPhonePayment?: boolean;

  @Invoice.property()
  public invoiceToken?: string | null;

  @Invoice.property()
  public isRemindable?: boolean;

  @Invoice.property(undefined, {embeddedByDefault: false})
  public owedMoney?: number;

  @Invoice.property(undefined, {embeddedByDefault: false})
  public paidMoney?: number;

  @Invoice.property(undefined, {embeddedByDefault: false})
  public isCompletelyPaid?: boolean;

  @Invoice.property()
  public responsibleManager?: User | null;

  @Invoice.property()
  public creator?: User | null;

  @Invoice.property()
  public client?: User;

  @Invoice.property()
  public clientCompany?: Company | null;

  @Invoice.property()
  public shipping?: Address | null;

  @Invoice.property()
  public domain?: Domain;

  @Invoice.property("Item")
  public items?: Array<Item>;

  @Invoice.property()
  public pdf?: MerchiFile | null;

  @Invoice.property()
  public receipt?: MerchiFile | null;

  @Invoice.property()
  public clientPhone?: PhoneNumber | null;

  @Invoice.property()
  public clientEmail?: EmailAddress | null;

  @Invoice.property()
  public clientCompanyPhone?: PhoneNumber | null;

  @Invoice.property()
  public clientCompanyEmail?: EmailAddress | null;

  @Invoice.property("DomainTag")
  public tags?: Array<DomainTag>;

  @Invoice.property("Shipment")
  public shipments?: Array<Shipment>;

  @Invoice.property("Notification")
  public notifications?: Array<Notification>;

  @Invoice.property("Job")
  public jobs?: Array<Job>;

  @Invoice.property()
  public cart?: Cart;

  @Invoice.property("Payment")
  public payments?: Array<Payment>;
}
