import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class PhoneNumber extends Entity {
  protected static resourceName: string = "phone_numbers";
  protected static singularName: string = "phoneNumber";
  protected static pluralName: string = "phoneNumbers";

  @PhoneNumber.property({type: Date})
  public archived?: Date | null;

  @PhoneNumber.property()
  public id?: number;

  @PhoneNumber.property()
  public number?: string;

  @PhoneNumber.property()
  public code?: string;

  @PhoneNumber.property({arrayType: "User"})
  public users?: Array<User>;

  @PhoneNumber.property({arrayType: "Company"})
  public companies?: Array<Company>;

  @PhoneNumber.property({arrayType: "Company"})
  public paymentCompanies?: Array<Company>;

  @PhoneNumber.property({embeddedByDefault: false})
  public localFormatNumber?: string;

  @PhoneNumber.property({embeddedByDefault: false})
  public internationalFormatNumber?: string;
}
