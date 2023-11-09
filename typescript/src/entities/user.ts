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
import { Company } from './company';
import { Role,
  DOMAIN_MANAGERS,
  MANAGEMENT_TEAM,
  BUSINESS_ACCOUNTS,
  ROLES_RANK
} from '../constants/roles';
import { InternalTag } from './internal_tag';
import { UserType } from '../constants/user_types';
import { SystemRoles as SR } from '../constants/system_roles';

import { some } from 'lodash';

export class User extends Entity {
  protected static resourceName = 'users';
  protected static singularName = 'user';
  protected static pluralName = 'users';

  @User.property({type: Date})
  public archived?: Date | null;

  @User.property()
  public id?: number;

  @User.property()
  public isSuperUser?: boolean;

  @User.property()
  public userType?: UserType;

  @User.property()
  public registeredAsGuest?: boolean;

  @User.property({arrayType: 'InternalTag'})
  public internalTags?: InternalTag[];

  @User.property({arrayType: 'Domain'})
  public registeredUnderDomains?: Domain[];

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
  public hasStore?: boolean;

  @User.property()
  public enableCrashReports?: boolean;

  @User.property()
  public enableClientEmails?: boolean;

  @User.property({type: String})
  public clientToken?: string | null;

  @User.property()
  public name?: string;

  @User.property({type: String})
  public internalUseNotes?: string;

  @User.property({type: String})
  public internalUseAiContext?: string;

  @User.property({type: String})
  public aiContext?: string;

  @User.property()
  public callToActions?: string;

  @User.property()
  public callToActionDetails?: any[];

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

  @User.property()
  public enableStoreNotifications?: boolean;

  @User.property()
  public isAdminOfSubscribedCompany?: boolean;

  @User.property({ arrayType: 'JobComment' })
  public jobComments?: JobComment[];

  @User.property({ arrayType: 'EmailAddress' })
  public _emailAddresses?: EmailAddress[];

  @User.property({ arrayType: 'PhoneNumber' })
  public _phoneNumbers?: PhoneNumber[];

  @User.property({ arrayType: 'Address' })
  public _addresses?: Address[];

  @User.property({ arrayType: 'UserCompany' })
  public _companies?: UserCompany[];

  @User.property({ arrayType: 'Company' })
  public companiesNeedStripe?: Company[];

  @User.property({ arrayType: 'Category' })
  public categories?: Category[];

  @User.property({ arrayType: 'Product' })
  public products?: Product[];

  @User.property({type: 'MerchiFile'})
  public profilePicture?: MerchiFile | null;

  @User.property({ arrayType: 'PhoneNumber' })
  public phoneNumbers?: PhoneNumber[];

  @User.property({ arrayType: 'Session' })
  public sessions?: Session[];

  @User.property({ arrayType: 'Shipment' })
  public shipmentsAsSender?: Shipment[];

  @User.property({ arrayType: 'Shipment' })
  public shipmentsAsReceiver?: Shipment[];

  @User.property({ arrayType: 'DraftComment' })
  public draftComments?: DraftComment[];

  @User.property({ arrayType: 'DraftComment' })
  public forwardedDraftComments?: DraftComment[];

  @User.property({ arrayType: 'SystemRole' })
  public systemRoles?: SystemRole[];

  @User.property({ arrayType: 'EmailAddress' })
  public emailAddresses?: EmailAddress[];

  @User.property({ arrayType: 'Notification' })
  public notifications?: Notification[];

  @User.property({ arrayType: 'Notification' })
  public sentNotifications?: Notification[];

  @User.property({ arrayType: 'Assignment' })
  public assignments?: Assignment[];

  @User.property({ arrayType: 'UserCompany' })
  public userCompanies?: UserCompany[];

  @User.property({ arrayType: 'Draft' })
  public drafts?: Draft[];

  @User.property({ arrayType: 'CompanyInvitation' })
  public companyInvitations?: CompanyInvitation[];

  @User.property({ arrayType: 'Address' })
  public addresses?: Address[];

  @User.property({ arrayType: 'MerchiFile' })
  public uploadFiles?: MerchiFile[];

  @User.property({ arrayType: 'JobComment' })
  public forwardedJobComments?: JobComment[];

  @User.property({ arrayType: 'Job' })
  public appliedJobs?: Job[];

  @User.property({ arrayType: 'Job' })
  public managedJobs?: Job[];

  @User.property({ arrayType: 'Job' })
  public draftingJobs?: Job[];

  @User.property({ arrayType: 'Product' })
  public saved_products?: Product[];

  @User.property({ arrayType: 'Cart' })
  public carts?: Cart[];

  @User.property({ arrayType: 'Payment' })
  public payments?: Payment[];

  @User.property({ arrayType: 'EnrolledDomain' })
  public enrolledDomains?: EnrolledDomain[];

  @User.property({ arrayType: 'Invoice' })
  public responsibleInvoices?: Invoice[];

  @User.property({ arrayType: 'Invoice' })
  public createdInvoices?: Invoice[];

  @User.property({ arrayType: 'Invoice' })
  public invoicesHas?: Invoice[];

  @User.property({ arrayType: 'DomainInvitation' })
  public sentDomainInvitations?: DomainInvitation[];

  @User.property({ arrayType: 'DomainInvitation' })
  public receivedDomainInvitations?: DomainInvitation[];

  @User.property({ arrayType: 'Theme' })
  public themes?: Theme[];

  @User.property({ arrayType: 'ProductionComment' })
  public forwardedProductionComments?: ProductionComment[];

  @User.property({ arrayType: 'Domain' })
  public accessibleDomainsAsClient?: Domain[];

  public publicCreate = this.createFactory(
    {resourceName: 'public_user_create'});

  public roleInDomain = (domain: Domain): Role => {
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
      enrolledDomain => enrolledDomain.domain && enrolledDomain.domain.id === domain.id);

    if (matchingEnrolledDomains.length > 1) {
      const highestRoleRank = Math.max(
        ...matchingEnrolledDomains.map(ed => ROLES_RANK.findIndex(e => e === ed.role)));
      return ROLES_RANK[highestRoleRank];
    }

    // due to some current system issues, user can have multiple enrolled domain
    // of one domain, if that is the case either of them can be consider as
    // valid, need to revisit it in the future related to #
    if (matchingEnrolledDomains.length > 0) {
      if (matchingEnrolledDomains[0].role !== undefined) {
        return matchingEnrolledDomains[0].role;
      }
    }
    return Role.PUBLIC;
  };

  public isSuper(): boolean {
    if (this.isSuperUser === undefined) {
      const err = 'isSuperUser is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    return this.isSuperUser!;
  }

  public companies(): Company[] {
    if (this.userCompanies === undefined) {
      const err = 'userCompanies is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    return this.userCompanies.map((userCompany) => {
      if (userCompany.company === undefined) {
        const err = 'userCompany.company is undefined, did you forget to embed it?';
        throw new Error(err);
      }
      return userCompany.company!;
    });
  }

  public isDomainManager(domain: Domain) {
    return DOMAIN_MANAGERS.includes(this.roleInDomain(domain));
  }

  public isManagementTeam(domain: Domain) {
    return MANAGEMENT_TEAM.includes(this.roleInDomain(domain));
  }

  public isNotClient(domain: Domain) {
    return BUSINESS_ACCOUNTS.includes(this.roleInDomain(domain));
  }

  public domainsByRoles(roles: Role[]) {
    if (this.enrolledDomains === undefined) {
      const err = 'enrolledDomains is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    const result = [];
    for (let i = 0; i < this.enrolledDomains.length; ++i) {
      const domain = this.enrolledDomains[i].domain;
      if (domain === undefined) {
        const err = 'domain is undefined, did you forget to embed it?';
        throw new Error(err);
      }
      if (this.hasAuthority(domain, roles)) {
        result.push(domain);
      }
    }
    return result;
  }

  public hasAuthority(domain: Domain, roles: Role[]) {
    if (this.isSuper()) {
      return true;
    }
    const role = this.roleInDomain(domain);
    for (let i = 0; i < roles.length; ++i) {
      if (roles[i] === role) {
        return true;
      }
    }
    return false;
  }

  public hasSystemRole(role: SR): boolean {
    if (this.systemRoles === undefined) {
      const err = 'systemRoles is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    return some(this.systemRoles.map(systemRole => systemRole.role === role));
  }

  public hasRoles(roles: Role[], combinationMethod = some) {
    if (this.enrolledDomains === undefined) {
      const err = 'enrolledDomains is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    const allRoles = this.enrolledDomains.map(
      enrolledDomain => enrolledDomain.getRole()
    );
    allRoles.push(Role.PUBLIC);
    return combinationMethod(
      roles.map((role) => allRoles.indexOf(role) !== -1)
    );
  }
}
