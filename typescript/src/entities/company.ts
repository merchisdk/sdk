import { Address } from './address';
import { AutomaticPaymentRelationship } from './automatic_payment_relationship';
import { Bank } from './bank';
import { Cart } from './cart';
import { CompanyInvitation } from './company_invitation';
import { CountryTax } from './country_tax';
import { Domain } from './domain';
import { EmailAddress } from './email_address';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { InternalTag } from './internal_tag';
import { Invoice } from './invoice';
import { Job } from './job';
import { PhoneNumber } from './phone_number';
import { Product } from './product';
import { Shipment } from './shipment';
import { User } from './user';
import { UserCompany } from './user_company';
import { SubscriptionPlan } from './subscription_plan';
import { PaymentDevice } from './payment_device';

export class Company extends Entity {
  protected static resourceName = 'companies';
  protected static singularName = 'company';
  protected static pluralName = 'companies';

  @Company.property({type: Date})
  public archived?: Date | null;

  @Company.property()
  public id?: number;

  @Company.property()
  public name?: string;

  @Company.property()
  public callToActions?: string;

  @Company.property()
  public callToActionDetails?: any[];

  @Company.property({type: String})
  public website?: string | null;

  @Company.property()
  public ownershipUnconfirmed?: boolean;

  @Company.property({type: String})
  public taxNumber?: string | null;

  @Company.property({type: String})
  public taxNumberType?: string | null;

  @Company.property({type: String})
  public paypalAccount?: string | null;

  @Company.property({type: String})
  public paypalPassword?: string | null;

  @Company.property({type: String})
  public paypalSignature?: string | null;

  @Company.property()
  public isPaypalValid?: boolean;

  @Company.property({embeddedByDefault: false})
  public isStripeAccountEnabled?: boolean;

  @Company.property()
  public stripeAccountId?: string;

  @Company.property({type: String})
  public stripeCustomerId?: string;

  @Company.property()
  public sendleActive?: boolean;

  @Company.property({type: String})
  public sendleApiKey?: string;

  @Company.property({type: String})
  public sendleId?: string;

  @Company.property({type: String})
  public unltdAiApiOrganizationId?: string;

  @Company.property({type: String})
  public unltdAiApiSecretKey?: string;

  @Company.property({type: String})
  public internalUseNotes?: string;

  @Company.property({type: String})
  public internalUseAiContext?: string;

  @Company.property({type: String})
  public aiContext?: string;

  @Company.property()
  public isNew?: boolean;

  @Company.property()
  public subscriptionOutstanding?: boolean;

  @Company.property({type: Date})
  public trialEndDate?: Date | null;

  @Company.property({type: Date})
  public trialEndDateUpdated?: Date | null;

  @Company.property({type: 'User'})
  public trialEndDateSetBy?: User;

  @Company.property()
  public isBlocked?: boolean;

  @Company.property()
  public isTesting?: boolean;

  @Company.property({type: String})
  public squareAccessToken?: string | null;

  @Company.property({type: String})
  public squareRefreshToken?: string | null;

  @Company.property({type: Date})
  public squareExpiresAt?: Date | null;

  @Company.property()
  public squareIsValid?: boolean;

  @Company.property({type: String})
  public squareMerchantId?: string | null;

  @Company.property({type: String})
  public squareWebLocationId?: string | null;

  @Company.property({type: String})
  public stripePublishableTestKey?: string | null;

  @Company.property({type: String})
  public stripeApiTestKey?: string | null;

  @Company.property({type: String})
  public stripePublishableKey?: string | null;

  @Company.property({type: String})
  public stripeApiKey?: string | null;

  @Company.property()
  public stripeConnectDisabled?: boolean;

  @Company.property()
  public isPayingCompany?: boolean;

  @Company.property()
  public isStripeValid?: boolean;

  @Company.property()
  public acceptSquare?: boolean;

  @Company.property()
  public acceptStripe?: boolean;

  @Company.property()
  public acceptPaypal?: boolean;

  @Company.property()
  public acceptUtrust?: boolean;

  @Company.property({type: String})
  public utrustApiKey?: string | null;

  @Company.property({type: String})
  public utrustWebhookKey?: string | null;

  @Company.property()
  public isUtrustValid?: boolean;

  @Company.property()
  public acceptBankTransfer?: boolean;

  @Company.property()
  public acceptPhonePayment?: boolean;

  @Company.property()
  public defaultCurrency?: string;

  @Company.property()
  public country?: string;

  @Company.property({arrayType: 'InternalTag'})
  public internalTags?: InternalTag[];

  @Company.property({type: MerchiFile})
  public logo?: MerchiFile | null;

  @Company.property({type: 'CountryTax'})
  public defaultTaxType?: CountryTax | null;

  @Company.property({arrayType: 'AutomaticPaymentRelationship'})
  public automaticPaymentRelationships?: AutomaticPaymentRelationship[];

  @Company.property({arrayType: 'CountryTax'})
  public taxTypes?: CountryTax[];

  @Company.property({arrayType: 'PaymentDevice'})
  public paymentDevices?: PaymentDevice[];

  @Company.property({type: SubscriptionPlan})
  public subscriptionPlan?: SubscriptionPlan | null;

  @Company.property({arrayType: 'EmailAddress'})
  public _emailAddresses?: EmailAddress[];

  @Company.property({arrayType: 'PhoneNumber'})
  public _paymentPhoneNumbers?: PhoneNumber[];

  @Company.property({arrayType: 'PhoneNumber'})
  public _phoneNumbers?: PhoneNumber[];

  @Company.property({arrayType: 'Address'})
  public _addresses?: Address[];

  @Company.property({arrayType: 'UserCompany'})
  public _users?: UserCompany[];

  @Company.property({arrayType: 'Shipment'})
  public shipmentsAsSender?: Shipment[];

  @Company.property({arrayType: 'Shipment'})
  public shipmentsAsReceiver?: Shipment[];

  @Company.property({arrayType: 'Product'})
  public savedProducts?: Product[];

  @Company.property({arrayType: 'Bank'})
  public banks?: Bank[];

  @Company.property({arrayType: 'UserCompany'})
  public userCompanies?: UserCompany[];

  @Company.property({arrayType: 'CompanyInvitation'})
  public companyInvitations?: CompanyInvitation[];

  @Company.property({arrayType: 'Job'})
  public appliedJobs?: Job[];

  @Company.property({arrayType: 'Cart'})
  public carts?: Cart[];

  @Company.property({arrayType: 'Domain'})
  public domains?: Domain[];

  @Company.property({arrayType: 'Domain'})
  public accessibleDomainsAsClientCompany?: Domain[];

  @Company.property({arrayType: 'EmailAddress'})
  public emailAddresses?: EmailAddress[];

  @Company.property({arrayType: 'PhoneNumber'})
  public phoneNumbers?: PhoneNumber[];

  @Company.property({arrayType: 'PhoneNumber'})
  public paymentPhoneNumbers?: PhoneNumber[];

  @Company.property({arrayType: 'Invoice'})
  public invoicesHas?: Invoice[];

  @Company.property({arrayType: 'Invoice'})
  public subscriptionInvoices?: Invoice[];

  @Company.property({arrayType: 'Address'})
  public addresses?: Address[];
}
