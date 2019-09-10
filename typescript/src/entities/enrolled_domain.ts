import { Domain } from './domain';
import { Entity } from '../entity';
import { User } from './user';

export class EnrolledDomain extends Entity {
  protected static resourceName: string = "enrolled_domains";
  protected static singularName: string = "enrolledDomain";
  protected static pluralName: string = "enrolledDomains";

  @EnrolledDomain.property("archived")
  public archived?: Date | null;

  @EnrolledDomain.property("id")
  public id?: number;

  @EnrolledDomain.property("role")
  public role?: number;

  @EnrolledDomain.property("user")
  public user?: User;

  @EnrolledDomain.property("domain")
  public domain?: Domain;
}
