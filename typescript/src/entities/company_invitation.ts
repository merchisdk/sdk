import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class CompanyInvitation extends Entity {
  protected static resourceName = 'company_invitations';
  protected static singularName = 'companyInvitation';
  protected static pluralName = 'companyInvitations';

  @CompanyInvitation.property({type: Date})
  public archived?: Date | null;

  @CompanyInvitation.property()
  public id?: number;

  @CompanyInvitation.property()
  public userName?: string;

  @CompanyInvitation.property()
  public userEmail?: string;

  @CompanyInvitation.property()
  public inviteAsAdmin?: boolean;

  @CompanyInvitation.property()
  public token?: string;

  @CompanyInvitation.property()
  public company?: Company;

  @CompanyInvitation.property()
  public sender?: User;
}
