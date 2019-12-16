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
import { Domain } from './domain';
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
import { Role, MANAGEMENT_TEAM } from '../constants/roles'

export class User extends Entity {
  protected static resourceName: string = 'users';
  protected static singularName: string = 'user';
  protected static pluralName: string = 'users';

  @User.property({type: Date})
  public archived?: Date | null;

  @User.property()
  public id?: number;

  @User.property()
  public isSuperUser?: boolean;

  @User.property({type: String})
  public password?: string | null;

  @User.property({type: String})
  public salt?: string | null;

  @User.property({type: String})
  public facebookUserId?: string | null;

  @User.property({type: String})
  public resetToken?: string | null;

  @User.property({type: String})
  public resetTokenDate?: Date | null;

  @User.property({type: String})
  public smsToken?: string | null;

  @User.property({type: Date})
  public resetSmsTokenDate?: Date | null;

  @User.property({type: String})
  public smsClientToken?: string | null;

  @User.property()
  public smsTokenConfirmed?: boolean;

  @User.property()
  public smsLoginThreshold?: number;

  @User.property()
  public enableCrashReports?: boolean;

  @User.property()
  public enableClientEmails?: boolean;

  @User.property({type: String})
  public clientToken?: string | null;

  @User.property()
  public name?: string;

  @User.property({type: String})
  public comments?: string | null;

  @User.property({type: String})
  public timezone?: string | null;

  @User.property({type: Date})
  public created?: Date | null;

  @User.property({type: String})
  public preferredLanguage?: string | null;

  @User.property()
  public enableInvoiceReminders?: boolean;

  @User.property({ arrayType: 'JobComment' })
  public jobComments?: Array<JobComment>;

  @User.property({ arrayType: 'EmailAddress' })
  public _emailAddresses?: Array<EmailAddress>;

  @User.property({ arrayType: 'PhoneNumber' })
  public _phoneNumbers?: Array<PhoneNumber>;

  @User.property({ arrayType: 'Address' })
  public _addresses?: Array<Address>;

  @User.property({ arrayType: 'UserCompany' })
  public _companies?: Array<UserCompany>;

  @User.property({ arrayType: 'Category' })
  public categories?: Array<Category>;

  @User.property({ arrayType: 'Product' })
  public products?: Array<Product>;

  @User.property({type: 'MerchiFile'})
  public profilePicture?: MerchiFile | null;

  @User.property({ arrayType: 'PhoneNumber' })
  public phoneNumbers?: Array<PhoneNumber>;

  @User.property({ arrayType: 'Session' })
  public sessions?: Array<Session>;

  @User.property({ arrayType: 'Shipment' })
  public shipmentsAsSender?: Array<Shipment>;

  @User.property({ arrayType: 'Shipment' })
  public shipmentsAsReceiver?: Array<Shipment>;

  @User.property({ arrayType: 'DraftComment' })
  public draftComments?: Array<DraftComment>;

  @User.property({ arrayType: 'DraftComment' })
  public forwardedDraftComments?: Array<DraftComment>;

  @User.property({ arrayType: 'SystemRole' })
  public systemRoles?: Array<SystemRole>;

  @User.property({ arrayType: 'EmailAddress' })
  public emailAddresses?: Array<EmailAddress>;

  @User.property({ arrayType: 'Notification' })
  public notifications?: Array<Notification>;

  @User.property({ arrayType: 'Notification' })
  public sentNotifications?: Array<Notification>;

  @User.property({ arrayType: 'Assignment' })
  public assignments?: Array<Assignment>;

  @User.property({ arrayType: 'UserCompany' })
  public userCompanies?: Array<UserCompany>;

  @User.property({ arrayType: 'Draft' })
  public drafts?: Array<Draft>;

  @User.property({ arrayType: 'CompanyInvitation' })
  public companyInvitations?: Array<CompanyInvitation>;

  @User.property({ arrayType: 'Address' })
  public addresses?: Array<Address>;

  @User.property({ arrayType: 'MerchiFile' })
  public uploadFiles?: Array<MerchiFile>;

  @User.property({ arrayType: 'JobComment' })
  public forwardedJobComments?: Array<JobComment>;

  @User.property({ arrayType: 'Job' })
  public appliedJobs?: Array<Job>;

  @User.property({ arrayType: 'Job' })
  public managedJobs?: Array<Job>;

  @User.property({ arrayType: 'Job' })
  public draftingJobs?: Array<Job>;

  @User.property({ arrayType: 'Product' })
  public saved_products?: Array<Product>;

  @User.property({ arrayType: 'Cart' })
  public carts?: Array<Cart>;

  @User.property({ arrayType: 'Payment' })
  public payments?: Array<Payment>;

  @User.property({ arrayType: 'EnrolledDomain' })
  public enrolledDomains?: Array<EnrolledDomain>;

  @User.property({ arrayType: 'Invoice' })
  public responsibleInvoices?: Array<Invoice>;

  @User.property({ arrayType: 'Invoice' })
  public createdInvoices?: Array<Invoice>;

  @User.property({ arrayType: 'Invoice' })
  public invoicesHas?: Array<Invoice>;

  @User.property({ arrayType: 'DomainInvitation' })
  public sentDomainInvitations?: Array<DomainInvitation>;

  @User.property({ arrayType: 'DomainInvitation' })
  public receivedDomainInvitations?: Array<DomainInvitation>;

  @User.property({ arrayType: 'Theme' })
  public themes?: Array<Theme>;

  @User.property({ arrayType: 'ProductionComment' })
  public forwardedProductionComments?: Array<ProductionComment>;

  public roleInDomain = (domain: Domain) => {
    if (this.enrolledDomains === undefined) {
      const err = 'enrolledDomains is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    if (
      this.enrolledDomains
        .map(enrolledDomain => enrolledDomain.domain)
        .some(domain => domain === undefined)
    ) {
      const err =
        'Domain of enrolled domain is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    const matchingEnrolledDomains = this.enrolledDomains.filter(
      enrolledDomain => enrolledDomain.domain!.id === domain.id
    );

    if (matchingEnrolledDomains.length > 1) {
      const err =
        'Multiple enrolled domains are matching, seems like something is wrong';
      throw new Error(err);
    }
    if (matchingEnrolledDomains.length === 0) {
      return Role.PUBLIC;
    }
    return matchingEnrolledDomains[0].role!;
  };

  public isManagementTeam(domain: Domain) {
    return MANAGEMENT_TEAM.includes(this.roleInDomain(domain));
  }
}
