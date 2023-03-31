import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class EmailAddress extends Entity {
  protected static resourceName = 'email_addresses';
  protected static singularName = 'emailAddress';
  protected static pluralName = 'emailAddresses';

  @EmailAddress.property({type: Date})
  public archived?: Date | null;

  @EmailAddress.property()
  public id?: number;

  @EmailAddress.property()
  public emailAddress?: string;

  @EmailAddress.property({arrayType: 'User'})
  public users?: User[];

  @EmailAddress.property({arrayType: 'Company'})
  public companies?: Company[];
}
