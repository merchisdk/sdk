import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class UserCompany extends Entity {
  protected static resourceName = 'user_companies';
  protected static singularName = 'userCompany';
  protected static pluralName = 'userCompanies';

  @UserCompany.property({type: Date})
  public archived?: Date | null;

  @UserCompany.property()
  public id?: number;

  @UserCompany.property({type: Boolean})
  public main?: boolean | null;

  @UserCompany.property()
  public isAdmin?: boolean;

  @UserCompany.property({type: User})
  public user?: User | null;

  @UserCompany.property({type: Company})
  public company?: Company | null;
}
