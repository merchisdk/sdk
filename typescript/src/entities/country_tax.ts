import { Company } from './company';
import { Entity } from '../entity';
import { Item } from './item';
import { Job } from './job';
import { Shipment } from './shipment';

export class CountryTax extends Entity {
  protected static resourceName: string = 'country_taxes';
  protected static singularName: string = 'countryTax';
  protected static pluralName: string = 'countryTaxes';

  @CountryTax.property({type: Date})
  public archived?: Date | null;

  @CountryTax.property()
  public id?: number;

  @CountryTax.property({type: String})
  public country?: string | null;

  @CountryTax.property()
  public taxName?: string;

  @CountryTax.property({type: Number})
  public taxPercent?: number | null;

  @CountryTax.property({arrayType: 'Shipment'})
  public shipments?: Shipment[];

  @CountryTax.property({type: 'Company'})
  public company?: Company;

  @CountryTax.property({arrayType: 'Job'})
  public jobs?: Job[];

  @CountryTax.property({arrayType: 'Item'})
  public items?: Item[];

  public static getNoTax() {
    const result = new this.merchi.CountryTax();
    result.id = 3;  // 3 is a reserved id for 'no tax' by the backend
    result.taxName = 'No tax';
    result.taxPercent = 0;
    return result;
  }
}
