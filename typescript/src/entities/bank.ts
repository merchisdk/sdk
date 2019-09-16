import { Address } from './address';
import { Company } from './company';
import { Entity } from '../entity';

export class Bank extends Entity {
  protected static resourceName: string = "banks";
  protected static singularName: string = "bank";
  protected static pluralName: string = "banks";

  @Bank.property()
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

  @Bank.property()
  public bsb?: string | null;

  @Bank.property()
  public swiftCode?: string | null;

  @Bank.property()
  public iban?: string | null;

  @Bank.property()
  public bankCode?: string | null;

  @Bank.property()
  public bankAddress?: Address | null;

  @Bank.property()
  public company?: Company;
}
