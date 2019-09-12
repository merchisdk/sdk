import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class CompanyInvitation extends Entity {
  protected static resourceName: string = "company_invitations";
  protected static singularName: string = "companyInvitation";
  protected static pluralName: string = "companyInvitations";

  @CompanyInvitation.property("archived")
  public archived?: Date | null;

  @CompanyInvitation.property("id")
  public id?: number;

  @CompanyInvitation.property("userName")
  public userName?: string;

  @CompanyInvitation.property("userEmail")
  public userEmail?: string;

  @CompanyInvitation.property("inviteAsAdmin")
  public inviteAsAdmin?: boolean;

  @CompanyInvitation.property("token")
  public token?: string;

  @CompanyInvitation.property("company")
  public company?: Company;

  @CompanyInvitation.property("sender")
  public sender?: User;
}
