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

  @Invoice.property("archived")
  public archived?: Date | null;

  @Invoice.property("id")
  public id?: number;

  @Invoice.property("creationDate")
  public creationDate?: Date | null;

  @Invoice.property("paymentDeadline")
  public paymentDeadline?: Date | null;

  @Invoice.property("reminded")
  public reminded?: Date | null;

  @Invoice.property("reminderMessage")
  public reminderMessage?: string;

  @Invoice.property("forceReminders")
  public forceReminders?: boolean;

  @Invoice.property("note")
  public note?: string | null;

  @Invoice.property("terms")
  public terms?: Date | null;

  @Invoice.property("subtotalCost")
  public subtotalCost?: number | null;

  @Invoice.property("taxAmount")
  public taxAmount?: number | null;

  @Invoice.property("totalCost")
  public totalCost?: number | null;

  @Invoice.property("sendSms")
  public sendSms?: boolean | null;

  @Invoice.property("sendEmail")
  public sendEmail?: boolean | null;

  @Invoice.property("unpaid")
  public unpaid?: boolean | null;

  @Invoice.property("currency")
  public currency?: string;

  @Invoice.property("acceptStripe")
  public acceptStripe?: boolean;

  @Invoice.property("acceptPaypal")
  public acceptPaypal?: boolean;

  @Invoice.property("acceptBankTransfer")
  public acceptBankTransfer?: boolean;

  @Invoice.property("acceptPhonePayment")
  public acceptPhonePayment?: boolean;

  @Invoice.property("invoiceToken")
  public invoiceToken?: string | null;

  @Invoice.property("isRemindable")
  public isRemindable?: boolean;

  @Invoice.property("owedMoney", undefined, {embeddedByDefault: false})
  public owedMoney?: number;

  @Invoice.property("paidMoney", undefined, {embeddedByDefault: false})
  public paidMoney?: number;

  @Invoice.property("isCompletelyPaid", undefined, {embeddedByDefault: false})
  public isCompletelyPaid?: number;

  @Invoice.property("responsibleManager")
  public responsibleManager?: User | null;

  @Invoice.property("creator")
  public creator?: User | null;

  @Invoice.property("client")
  public client?: User;

  @Invoice.property("clientCompany")
  public clientCompany?: Company | null;

  @Invoice.property("shipping")
  public shipping?: Address | null;

  @Invoice.property("domain")
  public domain?: Domain;

  @Invoice.property("items", "Item")
  public items?: Array<Item>;

  @Invoice.property("pdf")
  public pdf?: MerchiFile | null;

  @Invoice.property("receipt")
  public receipt?: MerchiFile | null;

  @Invoice.property("clientPhone")
  public clientPhone?: PhoneNumber | null;

  @Invoice.property("clientEmail")
  public clientEmail?: EmailAddress | null;

  @Invoice.property("clientCompanyPhone")
  public clientCompanyPhone?: PhoneNumber | null;

  @Invoice.property("clientCompanyEmail")
  public clientCompanyEmail?: EmailAddress | null;

  @Invoice.property("tags", "DomainTag")
  public tags?: Array<DomainTag>;

  @Invoice.property("shipments", "Shipment")
  public shipments?: Array<Shipment>;

  @Invoice.property("notifications", "Notification")
  public notifications?: Array<Notification>;

  @Invoice.property("jobs", "Job")
  public jobs?: Array<Job>;

  @Invoice.property("cart")
  public cart?: Cart;

  @Invoice.property("payments", "Payment")
  public payments?: Array<Payment>;
}
