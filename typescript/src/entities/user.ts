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

  @User.property("archived")
  public archived?: Date | null;

  @User.property("id")
  public id?: number;

  @User.property("isSuperUser")
  public isSuperUser?: boolean;

  @User.property("password")
  public password?: string | null;

  @User.property("salt")
  public salt?: string | null;

  @User.property("facebookUserId")
  public facebookUserId?: string | null;

  @User.property("resetToken")
  public resetToken?: string | null;

  @User.property("resetTokenDate")
  public resetTokenDate?: Date | null;

  @User.property("smsToken")
  public smsToken?: string | null;

  @User.property("resetSmsTokenDate")
  public resetSmsTokenDate?: Date | null;

  @User.property("smsClientToken")
  public smsClientToken?: string | null;

  @User.property("smsTokenConfirmed")
  public smsTokenConfirmed?: boolean;

  @User.property("smsLoginThreshold")
  public smsLoginThreshold?: number;

  @User.property("enableCrashReports")
  public enableCrashReports?: boolean;

  @User.property("enableClientEmails")
  public enableClientEmails?: boolean;

  @User.property("clientToken")
  public clientToken?: string | null;

  @User.property("name")
  public name?: string;

  @User.property("comments")
  public comments?: string | null;

  @User.property("timezone")
  public timezone?: string | null;

  @User.property("created")
  public created?: Date | null;

  @User.property("preferredLanguage")
  public preferredLanguage?: string | null;

  @User.property("enableInvoiceReminders")
  public enableInvoiceReminders?: boolean;

  @User.property("jobComments", "JobComment")
  public jobComments?: Array<JobComment>;

  @User.property("_emailAddresses", "EmailAddress")
  public _emailAddresses?: Array<EmailAddress>;

  @User.property("_phoneNumbers", "PhoneNumber")
  public _phoneNumbers?: Array<PhoneNumber>;

  @User.property("_addresses", "Address")
  public _addresses?: Array<Address>;

  @User.property("_companies", "UserCompany")
  public _companies?: Array<UserCompany>;

  @User.property("categories", "Category")
  public categories?: Array<Category>;

  @User.property("products", "Product")
  public products?: Array<Product>;

  @User.property("profilePicture")
  public profilePicture?: MerchiFile | null;

  @User.property("phoneNumbers", "PhoneNumber")
  public phoneNumbers?: Array<PhoneNumber>;

  @User.property("sessions", "Session")
  public sessions?: Array<Session>;

  @User.property("shipmentsAsSender", "Shipment")
  public shipmentsAsSender?: Array<Shipment>;

  @User.property("shipmentsAsReceiver", "Shipment")
  public shipmentsAsReceiver?: Array<Shipment>;

  @User.property("draftComments", "DraftComment")
  public draftComments?: Array<DraftComment>;

  @User.property("forwardedDraftComments", "DraftComment")
  public forwardedDraftComments?: Array<DraftComment>;

  @User.property("systemRoles", "SystemRole")
  public systemRoles?: Array<SystemRole>;

  @User.property("emailAddresses", "EmailAddress")
  public emailAddresses?: Array<EmailAddress>;

  @User.property("notifications", "Notification")
  public notifications?: Array<Notification>;

  @User.property("sentNotifications", "Notification")
  public sentNotifications?: Array<Notification>;

  @User.property("assignments", "Assignment")
  public assignments?: Array<Assignment>;

  @User.property("userCompanies", "UserCompany")
  public userCompanies?: Array<UserCompany>;

  @User.property("drafts", "Draft")
  public drafts?: Array<Draft>;

  @User.property("companyInvitations", "CompanyInvitation")
  public companyInvitations?: Array<CompanyInvitation>;

  @User.property("addresses", "Address")
  public addresses?: Array<Address>;

  @User.property("uploadFiles", "MerchiFile")
  public uploadFiles?: Array<MerchiFile>;

  @User.property("forwardedJobComments", "JobComment")
  public forwardedJobComments?: Array<JobComment>;

  @User.property("appliedJobs", "Job")
  public appliedJobs?: Array<Job>;

  @User.property("managedJobs", "Job")
  public managedJobs?: Array<Job>;

  @User.property("draftingJobs", "Job")
  public draftingJobs?: Array<Job>;

  @User.property("saved_products", "Product")
  public saved_products?: Array<Product>;

  @User.property("carts", "Cart")
  public carts?: Array<Cart>;

  @User.property("payments", "Payment")
  public payments?: Array<Payment>;

  @User.property("enrolledDomains", "EnrolledDomain")
  public enrolledDomains?: Array<EnrolledDomain>;

  @User.property("responsibleInvoices", "Invoice")
  public responsibleInvoices?: Array<Invoice>;

  @User.property("createdInvoices", "Invoice")
  public createdInvoices?: Array<Invoice>;

  @User.property("invoicesHas", "Invoice")
  public invoicesHas?: Array<Invoice>;

  @User.property("sentDomainInvitations", "DomainInvitation")
  public sentDomainInvitations?: Array<DomainInvitation>;

  @User.property("receivedDomainInvitations", "DomainInvitation")
  public receivedDomainInvitations?: Array<DomainInvitation>;

  @User.property("themes", "Theme")
  public themes?: Array<Theme>;

  @User.property("forwardedProductionComments", "ProductionComment")
  public forwardedProductionComments?: Array<ProductionComment>;
}
