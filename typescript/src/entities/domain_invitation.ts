import { Domain } from './domain';
import { Entity } from '../entity';
import { User } from './user';

export class DomainInvitation extends Entity {
  protected static resourceName: string = "domain_invitations";
  protected static singularName: string = "domainInvitation";
  protected static pluralName: string = "domainInvitations";

  @DomainInvitation.property()
  public archived?: Date | null;

  @DomainInvitation.property()
  public id?: number;

  @DomainInvitation.property()
  public userName?: string;

  @DomainInvitation.property()
  public userEmail?: string;

  @DomainInvitation.property()
  public role?: number;

  @DomainInvitation.property()
  public token?: string;

  @DomainInvitation.property()
  public domain?: Domain;

  @DomainInvitation.property()
  public sender?: User;

  @DomainInvitation.property()
  public user?: User | null;
}
