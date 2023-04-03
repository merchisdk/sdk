import { Address } from './address';
import { Company } from './company';
import { Entity } from '../entity';

export class Bank extends Entity {
  protected static resourceName = 'banks';
  protected static singularName = 'bank';
  protected static pluralName = 'banks';

  @Bank.property({type: Date})
  public archived?: Date | null;

  @Bank.property()
  public id?: number;

  @Bank.property()
  public default?: boolean;

  @Bank.property()
  public bankName?: string;

  @Bank.property()
  public accountNumber?: string;

  @Bank.property()
  public accountName?: string;

  @Bank.property({type: String})
  public bsb?: string | null;

  @Bank.property({type: String})
  public swiftCode?: string | null;

  @Bank.property({type: String})
  public iban?: string | null;

  @Bank.property({type: String})
  public bankCode?: string | null;

  @Bank.property({type: 'Address'})
  public bankAddress?: Address | null;

  @Bank.property()
  public company?: Company;
}
