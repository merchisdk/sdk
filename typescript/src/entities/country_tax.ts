import { Company } from './company';
import { Entity } from '../entity';
import { Item } from './item';
import { Job } from './job';
import { Shipment } from './shipment';

export class CountryTax extends Entity {
  protected static resourceName: string = "country_taxes";
  protected static singularName: string = "countryTax";
  protected static pluralName: string = "countryTaxes";

  @CountryTax.property("archived")
  public archived?: Date | null;

  @CountryTax.property("id")
  public id?: number;

  @CountryTax.property("country")
  public country?: string | null;

  @CountryTax.property("taxName")
  public taxName?: string;

  @CountryTax.property("taxPercent")
  public taxPercent?: number | null;

  @CountryTax.property("shipments", "Shipment")
  public shipments?: Array<Shipment>;

  @CountryTax.property("companies", "Company")
  public companies?: Array<Company>;

  @CountryTax.property("jobs", "Job")
  public jobs?: Array<Job>;

  @CountryTax.property("items", "Item")
  public items?: Array<Item>;
}
