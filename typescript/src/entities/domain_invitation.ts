import { Domain } from './domain';
import { Entity } from '../entity';
import { User } from './user';

export class DomainInvitation extends Entity {
  protected static resourceName = 'domain_invitations';
  protected static singularName = 'domainInvitation';
  protected static pluralName = 'domainInvitations';

  @DomainInvitation.property({type: Date})
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

  @DomainInvitation.property({type: Date})
  public user?: User | null;
}
