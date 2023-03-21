import { Domain } from './domain';
import { Entity } from '../entity';
import { User } from './user';
import { Role } from '../constants/roles';
import { DomainType } from '../constants/domain_types';

export class EnrolledDomain extends Entity {
  protected static resourceName = 'enrolled_domains';
  protected static singularName = 'enrolledDomain';
  protected static pluralName = 'enrolledDomains';

  @EnrolledDomain.property({type: Date})
  public archived?: Date | null;

  @EnrolledDomain.property()
  public id?: number;

  @EnrolledDomain.property()
  public isJobsAssignee?: boolean;

  @EnrolledDomain.property()
  public role?: Role;

  @EnrolledDomain.property()
  public user?: User;

  @EnrolledDomain.property()
  public domain?: Domain;

  public getRole(): Role {
    if (this.domain === undefined) {
      const err = 'domain is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    if (this.domain.domainType === DomainType.DOMAIN_SUPPLIER) {
      return Role.SUPPLIER;
    }
    return this.role ? this.role : Role.PUBLIC;
  }
}
