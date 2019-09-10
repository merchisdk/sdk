import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class UserCompany extends Entity {
  protected static resourceName: string = "user_companies";
  protected static singularName: string = "userCompany";
  protected static pluralName: string = "userCompanies";

  @UserCompany.property("archived")
  public archived?: Date | null;

  @UserCompany.property("id")
  public id?: number;

  @UserCompany.property("main")
  public main?: boolean | null;

  @UserCompany.property("isAdmin")
  public isAdmin?: boolean;

  @UserCompany.property("user")
  public user?: User | null;

  @UserCompany.property("company")
  public company?: Company | null;
}
