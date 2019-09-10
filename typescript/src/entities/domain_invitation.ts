import { Domain } from './domain';
import { Entity } from '../entity';
import { User } from './user';

export class DomainInvitation extends Entity {
  protected static resourceName: string = "domain_invitations";
  protected static singularName: string = "domainInvitation";
  protected static pluralName: string = "domainInvitations";

  @DomainInvitation.property("archived")
  public archived?: Date | null;

  @DomainInvitation.property("id")
  public id?: number;

  @DomainInvitation.property("userName")
  public userName?: string;

  @DomainInvitation.property("userEmail")
  public userEmail?: string;

  @DomainInvitation.property("role")
  public role?: number;

  @DomainInvitation.property("token")
  public token?: string;

  @DomainInvitation.property("domain")
  public domain?: Domain;

  @DomainInvitation.property("sender")
  public sender?: User;

  @DomainInvitation.property("user")
  public user?: User | null;
}
