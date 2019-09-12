import { Address } from './address';
import { Bank } from './bank';
import { Cart } from './cart';
import { CompanyInvitation } from './company_invitation';
import { CountryTax } from './country_tax';
import { Domain } from './domain';
import { EmailAddress } from './email_address';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Invoice } from './invoice';
import { Job } from './job';
import { PhoneNumber } from './phone_number';
import { Product } from './product';
import { Shipment } from './shipment';
import { UserCompany } from './user_company';

export class Company extends Entity {
  protected static resourceName: string = "companies";
  protected static singularName: string = "company";
  protected static pluralName: string = "companies";

  @Company.property("archived")
  public archived?: Date | null;

  @Company.property("id")
  public id?: number;

  @Company.property("name")
  public name?: string;

  @Company.property("website")
  public website?: string | null;

  @Company.property("temporaryCreated")
  public temporaryCreated?: boolean;

  @Company.property("taxNumber")
  public taxNumber?: string | null;

  @Company.property("taxNumberType")
  public taxNumberType?: number | null;

  @Company.property("paypalAccount")
  public paypalAccount?: string | null;

  @Company.property("paypalPassword")
  public paypalPassword?: string | null;

  @Company.property("paypalSignature")
  public paypalSignature?: string | null;

  @Company.property("isPaypalValid")
  public isPaypalValid?: boolean;

  @Company.property("stripePublishableKey")
  public stripePublishableKey?: string | null;

  @Company.property("stripeApiKey")
  public stripeApiKey?: string | null;

  @Company.property("isStripeValid")
  public isStripeValid?: boolean;

  @Company.property("acceptStripe")
  public acceptStripe?: boolean;

  @Company.property("acceptPaypal")
  public acceptPaypal?: boolean;

  @Company.property("acceptBankTransfer")
  public acceptBankTransfer?: boolean;

  @Company.property("acceptPhonePayment")
  public acceptPhonePayment?: boolean;

  @Company.property("defaultCurrency")
  public defaultCurrency?: string;

  @Company.property("country")
  public country?: string;

  @Company.property("logo")
  public logo?: MerchiFile | null;

  @Company.property("defaultTaxType")
  public defaultTaxType?: CountryTax | null;

  @Company.property("_emailAddresses", "EmailAddress")
  public _emailAddresses?: Array<EmailAddress>;

  @Company.property("_paymentPhoneNumbers", "PhoneNumber")
  public _paymentPhoneNumbers?: Array<PhoneNumber>;

  @Company.property("_phoneNumbers", "PhoneNumber")
  public _phoneNumbers?: Array<PhoneNumber>;

  @Company.property("_addresses", "Address")
  public _addresses?: Array<Address>;

  @Company.property("_users", "UserCompany")
  public _users?: Array<UserCompany>;

  @Company.property("shipmentsAsSender", "Shipment")
  public shipmentsAsSender?: Array<Shipment>;

  @Company.property("shipmentsAsReceiver", "Shipment")
  public shipmentsAsReceiver?: Array<Shipment>;

  @Company.property("saved_products", "Product")
  public saved_products?: Array<Product>;

  @Company.property("banks", "Bank")
  public banks?: Array<Bank>;

  @Company.property("userCompanies", "UserCompany")
  public userCompanies?: Array<UserCompany>;

  @Company.property("companyInvitations", "CompanyInvitation")
  public companyInvitations?: Array<CompanyInvitation>;

  @Company.property("appliedJobs", "Job")
  public appliedJobs?: Array<Job>;

  @Company.property("carts", "Cart")
  public carts?: Array<Cart>;

  @Company.property("domains", "Domain")
  public domains?: Array<Domain>;

  @Company.property("emailAddresses", "EmailAddress")
  public emailAddresses?: Array<EmailAddress>;

  @Company.property("phoneNumbers", "PhoneNumber")
  public phoneNumbers?: Array<PhoneNumber>;

  @Company.property("paymentPhoneNumbers", "PhoneNumber")
  public paymentPhoneNumbers?: Array<PhoneNumber>;

  @Company.property("invoicesHas", "Invoice")
  public invoicesHas?: Array<Invoice>;

  @Company.property("addresses", "Address")
  public addresses?: Array<Address>;
}
