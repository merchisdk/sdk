import { Address } from './address';
import { Assignment } from './assignment';
import { Cart } from './cart';
import { Category } from './category';
import { CompanyInvitation } from './company_invitation';
import { DomainInvitation } from './domain_invitation';
import { Draft } from './draft';
import { DraftComment } from './draft_comment';
import { EmailAddress } from './email_address';
import { EnrolledDomain } from './enrolled_domain';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Invoice } from './invoice';
import { Job } from './job';
import { JobComment } from './job_comment';
import { Notification } from './notification';
import { Payment } from './payment';
import { PhoneNumber } from './phone_number';
import { Product } from './product';
import { ProductionComment } from './production_comment';
import { Session } from './session';
import { Shipment } from './shipment';
import { SystemRole } from './system_role';
import { Theme } from './theme';
import { UserCompany } from './user_company';

export class User extends Entity {
  protected static resourceName: string = "users";
  protected static singularName: string = "user";
  protected static pluralName: string = "users";

  @User.property()
  public archived?: Date | null;

  @User.property()
  public id?: number;

  @User.property()
  public isSuperUser?: boolean;

  @User.property()
  public password?: string | null;

  @User.property()
  public salt?: string | null;

  @User.property()
  public facebookUserId?: string | null;

  @User.property()
  public resetToken?: string | null;

  @User.property()
  public resetTokenDate?: Date | null;

  @User.property()
  public smsToken?: string | null;

  @User.property()
  public resetSmsTokenDate?: Date | null;

  @User.property()
  public smsClientToken?: string | null;

  @User.property()
  public smsTokenConfirmed?: boolean;

  @User.property()
  public smsLoginThreshold?: number;

  @User.property()
  public enableCrashReports?: boolean;

  @User.property()
  public enableClientEmails?: boolean;

  @User.property()
  public clientToken?: string | null;

  @User.property()
  public name?: string;

  @User.property()
  public comments?: string | null;

  @User.property()
  public timezone?: string | null;

  @User.property()
  public created?: Date | null;

  @User.property()
  public preferredLanguage?: string | null;

  @User.property()
  public enableInvoiceReminders?: boolean;

  @User.property("JobComment")
  public jobComments?: Array<JobComment>;

  @User.property("EmailAddress")
  public _emailAddresses?: Array<EmailAddress>;

  @User.property("PhoneNumber")
  public _phoneNumbers?: Array<PhoneNumber>;

  @User.property("Address")
  public _addresses?: Array<Address>;

  @User.property("UserCompany")
  public _companies?: Array<UserCompany>;

  @User.property("Category")
  public categories?: Array<Category>;

  @User.property("Product")
  public products?: Array<Product>;

  @User.property()
  public profilePicture?: MerchiFile | null;

  @User.property("PhoneNumber")
  public phoneNumbers?: Array<PhoneNumber>;

  @User.property("Session")
  public sessions?: Array<Session>;

  @User.property("Shipment")
  public shipmentsAsSender?: Array<Shipment>;

  @User.property("Shipment")
  public shipmentsAsReceiver?: Array<Shipment>;

  @User.property("DraftComment")
  public draftComments?: Array<DraftComment>;

  @User.property("DraftComment")
  public forwardedDraftComments?: Array<DraftComment>;

  @User.property("SystemRole")
  public systemRoles?: Array<SystemRole>;

  @User.property("EmailAddress")
  public emailAddresses?: Array<EmailAddress>;

  @User.property("Notification")
  public notifications?: Array<Notification>;

  @User.property("Notification")
  public sentNotifications?: Array<Notification>;

  @User.property("Assignment")
  public assignments?: Array<Assignment>;

  @User.property("UserCompany")
  public userCompanies?: Array<UserCompany>;

  @User.property("Draft")
  public drafts?: Array<Draft>;

  @User.property("CompanyInvitation")
  public companyInvitations?: Array<CompanyInvitation>;

  @User.property("Address")
  public addresses?: Array<Address>;

  @User.property("MerchiFile")
  public uploadFiles?: Array<MerchiFile>;

  @User.property("JobComment")
  public forwardedJobComments?: Array<JobComment>;

  @User.property("Job")
  public appliedJobs?: Array<Job>;

  @User.property("Job")
  public managedJobs?: Array<Job>;

  @User.property("Job")
  public draftingJobs?: Array<Job>;

  @User.property("Product")
  public saved_products?: Array<Product>;

  @User.property("Cart")
  public carts?: Array<Cart>;

  @User.property("Payment")
  public payments?: Array<Payment>;

  @User.property("EnrolledDomain")
  public enrolledDomains?: Array<EnrolledDomain>;

  @User.property("Invoice")
  public responsibleInvoices?: Array<Invoice>;

  @User.property("Invoice")
  public createdInvoices?: Array<Invoice>;

  @User.property("Invoice")
  public invoicesHas?: Array<Invoice>;

  @User.property("DomainInvitation")
  public sentDomainInvitations?: Array<DomainInvitation>;

  @User.property("DomainInvitation")
  public receivedDomainInvitations?: Array<DomainInvitation>;

  @User.property("Theme")
  public themes?: Array<Theme>;

  @User.property("ProductionComment")
  public forwardedProductionComments?: Array<ProductionComment>;
}
