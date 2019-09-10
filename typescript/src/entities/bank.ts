import { Address } from './address';
import { Company } from './company';
import { Entity } from '../entity';

export class Bank extends Entity {
  protected static resourceName: string = "banks";
  protected static singularName: string = "bank";
  protected static pluralName: string = "banks";

  @Bank.property("archived")
  public archived?: Date | null;

  @Bank.property("id")
  public id?: number;

  @Bank.property("default")
  public default?: boolean;

  @Bank.property("bankName")
  public bankName?: string;

  @Bank.property("accountNumber")
  public accountNumber?: string;

  @Bank.property("accountName")
  public accountName?: string;

  @Bank.property("bsb")
  public bsb?: string | null;

  @Bank.property("swiftCode")
  public swiftCode?: string | null;

  @Bank.property("iban")
  public iban?: string | null;

  @Bank.property("bankCode")
  public bankCode?: string | null;

  @Bank.property("bankAddress")
  public bankAddress?: Address | null;

  @Bank.property("company")
  public company?: Company;
}
