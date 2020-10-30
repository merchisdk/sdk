import { Domain } from './domain';
import { Entity } from '../entity';
import { User } from './user';
import { Role } from '../constants/roles';

export class EnrolledDomain extends Entity {
  protected static resourceName: string = 'enrolled_domains';
  protected static singularName: string = 'enrolledDomain';
  protected static pluralName: string = 'enrolledDomains';

  @EnrolledDomain.property({type: Date})
  public archived?: Date | null;

  @EnrolledDomain.property()
  public id?: number;

  @EnrolledDomain.property()
  public role?: Role;

  @EnrolledDomain.property()
  public user?: User;

  @EnrolledDomain.property()
  public domain?: Domain;
}
