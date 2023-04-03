import { Company } from './company';
import { Entity } from '../entity';
import { User } from './user';

export class PhoneNumber extends Entity {
  protected static resourceName = 'phone_numbers';
  protected static singularName = 'phoneNumber';
  protected static pluralName = 'phoneNumbers';

  @PhoneNumber.property({type: Date})
  public archived?: Date | null;

  @PhoneNumber.property()
  public id?: number;

  @PhoneNumber.property()
  public number?: string;

  @PhoneNumber.property()
  public code?: string;

  @PhoneNumber.property({arrayType: 'User'})
  public users?: User[];

  @PhoneNumber.property({arrayType: 'Company'})
  public companies?: Company[];

  @PhoneNumber.property({arrayType: 'Company'})
  public paymentCompanies?: Company[];

  @PhoneNumber.property({embeddedByDefault: false})
  public localFormatNumber?: string;

  @PhoneNumber.property({embeddedByDefault: false})
  public internationalFormatNumber?: string;
}
