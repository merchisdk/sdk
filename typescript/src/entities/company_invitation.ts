import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class CompanyInvitation extends Entity {
  protected static resourceName: string = 'company_invitations';
  protected static singularName: string = 'companyInvitation';
  protected static pluralName: string = 'companyInvitations';

  @CompanyInvitation.property()
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
