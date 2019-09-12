import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class PhoneNumber extends Entity {
  protected static resourceName: string = "phone_numbers";
  protected static singularName: string = "phoneNumber";
  protected static pluralName: string = "phoneNumbers";

  @PhoneNumber.property("archived")
  public archived?: Date | null;

  @PhoneNumber.property("id")
  public id?: number;

  @PhoneNumber.property("number")
  public number?: string;

  @PhoneNumber.property("code")
  public code?: string;

  @PhoneNumber.property("users", "User")
  public users?: Array<User>;

  @PhoneNumber.property("companies", "Company")
  public companies?: Array<Company>;

  @PhoneNumber.property("paymentCompanies", "Company")
  public paymentCompanies?: Array<Company>;

  @PhoneNumber.property("localFormatNumber", undefined,
                        {embeddedByDefault: false})
  public localFormatNumber?: string;

  @PhoneNumber.property("internationalFormatNumber", undefined,
                        {embeddedByDefault: false})
  public internationalFormatNumber?: string;
}
