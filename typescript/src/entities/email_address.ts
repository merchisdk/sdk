import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class EmailAddress extends Entity {
  protected static resourceName: string = "email_addresses";
  protected static singularName: string = "emailAddress";
  protected static pluralName: string = "emailAddresses";

  @EmailAddress.property()
  public archived?: Date | null;

  @EmailAddress.property()
  public id?: number;

  @EmailAddress.property()
  public emailAddress?: string;

  @EmailAddress.property("User")
  public users?: Array<User>;

  @EmailAddress.property("Company")
  public companies?: Array<Company>;
}
