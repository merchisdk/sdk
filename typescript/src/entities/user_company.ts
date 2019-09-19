import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class UserCompany extends Entity {
  protected static resourceName: string = "user_companies";
  protected static singularName: string = "userCompany";
  protected static pluralName: string = "userCompanies";

  @UserCompany.property()
  public archived?: Date | null;

  @UserCompany.property()
  public id?: number;

  @UserCompany.property()
  public main?: boolean | null;

  @UserCompany.property()
  public isAdmin?: boolean;

  @UserCompany.property()
  public user?: User | null;

  @UserCompany.property()
  public company?: Company | null;
}
