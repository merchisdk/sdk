import { Company } from './company';
import { Entity } from '../entity';
import { Item } from './item';
import { Job } from './job';
import { Shipment } from './shipment';

export class CountryTax extends Entity {
  protected static resourceName: string = "country_taxes";
  protected static singularName: string = "countryTax";
  protected static pluralName: string = "countryTaxes";

  @CountryTax.property()
  public archived?: Date | null;

  @CountryTax.property()
  public id?: number;

  @CountryTax.property()
  public country?: string | null;

  @CountryTax.property()
  public taxName?: string;

  @CountryTax.property()
  public taxPercent?: number | null;

  @CountryTax.property("Shipment")
  public shipments?: Array<Shipment>;

  @CountryTax.property("Company")
  public companies?: Array<Company>;

  @CountryTax.property("Job")
  public jobs?: Array<Job>;

  @CountryTax.property("Item")
  public items?: Array<Item>;
}
