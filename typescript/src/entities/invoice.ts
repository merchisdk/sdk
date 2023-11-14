import { Address } from './address';
import { Cart } from './cart';
import { Company } from './company';
import { Domain } from './domain';
import { DomainTag } from './domain_tag';
import { EmailAddress } from './email_address';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { InternalTag } from './internal_tag';
import { Item } from './item';
import { Job } from './job';
import { Quote } from './quote';
import { Notification } from './notification';
import { Payment } from './payment';
import { PhoneNumber } from './phone_number';
import { Shipment } from './shipment';
import { User } from './user';

export class Invoice extends Entity {
  protected static resourceName = 'invoices';
  protected static singularName = 'invoice';
  protected static pluralName = 'invoices';

  @Invoice.property({type: Date})
  public archived?: Date | null;

  @Invoice.property()
  public id?: number;

  @Invoice.property({type: Date})
  public creationDate?: Date | null;

  @Invoice.property({type: Date})
  public paymentDeadline?: Date | null;

  @Invoice.property({type: Date})
  public reminded?: Date | null;

  @Invoice.property()
  public reminderMessage?: string;

  @Invoice.property()
  public shopifyOrderId?: string;

  @Invoice.property()
  public forceReminders?: boolean;

  @Invoice.property()
  public buySide?: boolean;

  @Invoice.property()
  public canAutoPay?: boolean;

  @Invoice.property({type: String})
  public note?: string | null;

  @Invoice.property({type: Date})
  public terms?: Date | null;

  @Invoice.property({type: Number})
  public subtotalCost?: number | null;

  @Invoice.property({type: Number})
  public taxAmount?: number | null;

  @Invoice.property({type: Number})
  public totalCost?: number | null;

  @Invoice.property({type: Boolean})
  public sendSms?: boolean | null;

  @Invoice.property({type: Boolean})
  public sendEmail?: boolean | null;

  @Invoice.property({type: Boolean})
  public unpaid?: boolean | null;

  @Invoice.property()
  public currency?: string;

  @Invoice.property()
  public acceptSquare?: boolean;

  @Invoice.property()
  public acceptStripe?: boolean;

  @Invoice.property()
  public acceptPaypal?: boolean;

  @Invoice.property()
  public acceptUtrust?: boolean;

  @Invoice.property()
  public acceptBankTransfer?: boolean;

  @Invoice.property()
  public acceptPhonePayment?: boolean;

  @Invoice.property({type: String})
  public invoiceToken?: string | null;

  @Invoice.property()
  public isRemindable?: boolean;

  @Invoice.property({embeddedByDefault: false})
  public owedMoney?: number;

  @Invoice.property({embeddedByDefault: false})
  public paidMoney?: number;

  @Invoice.property({embeddedByDefault: false})
  public isCompletelyPaid?: boolean;

  @Invoice.property({type: User})
  public responsibleManager?: User | null;

  @Invoice.property({type: User})
  public creator?: User | null;

  @Invoice.property()
  public client?: User;

  @Invoice.property({type: Company})
  public clientCompany?: Company | null;

  @Company.property({arrayType: 'Company'})
  public subscriptionCompanies?: Company[];

  @Invoice.property({type: Address})
  public shipping?: Address | null;

  @Invoice.property()
  public domain?: Domain;

  @Invoice.property({arrayType: 'Item'})
  public items?: Item[];

  @Invoice.property({type: MerchiFile})
  public pdf?: MerchiFile | null;

  @Invoice.property({type: MerchiFile})
  public receipt?: MerchiFile | null;

  @Invoice.property({type: PhoneNumber})
  public clientPhone?: PhoneNumber | null;

  @Invoice.property({type: EmailAddress})
  public clientEmail?: EmailAddress | null;

  @Invoice.property({type: PhoneNumber})
  public clientCompanyPhone?: PhoneNumber | null;

  @Invoice.property({type: EmailAddress})
  public clientCompanyEmail?: EmailAddress | null;

  @Invoice.property({arrayType: 'InternalTag'})
  public internalTags?: InternalTag[];

  @Invoice.property({arrayType: 'DomainTag'})
  public tags?: DomainTag[];

  @Invoice.property({arrayType: 'Shipment'})
  public shipments?: Shipment[];

  @Invoice.property({arrayType: 'Notification'})
  public notifications?: Notification[];

  @Invoice.property({arrayType: 'Job'})
  public jobs?: Job[];

  @Invoice.property({arrayType: 'Quote'})
  public quotes?: Quote[];

  @Invoice.property()
  public cart?: Cart;

  @Invoice.property({arrayType: 'Payment'})
  public payments?: Payment[];
}
