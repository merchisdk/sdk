import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class EmailAddress extends Entity {
  protected static resourceName: string = "email_addresses";
  protected static singularName: string = "emailAddress";
  protected static pluralName: string = "emailAddresses";

  @EmailAddress.property("archived")
  public archived?: Date | null;

  @EmailAddress.property("id")
  public id?: number;

  @EmailAddress.property("emailAddress")
  public emailAddress?: string;

  @EmailAddress.property("users", "User")
  public users?: Array<User>;

  @EmailAddress.property("companies", "Company")
  public companies?: Array<Company>;
}
