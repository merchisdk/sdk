import { Entity } from '../entity';
import { Address } from './address';
import { Company } from './company';
import { CountryTax } from './country_tax';
import { Product } from './product';
import { ShipmentMethodVariation } from './shipment_method_variation';

export class ShipmentMethod extends Entity {
  protected static resourceName: string = 'shipment_methods';
  protected static singularName: string = 'shipmentMethod';
  protected static pluralName: string = 'shipmentMethods';

  @ShipmentMethod.property()
  public id?: number;

  @ShipmentMethod.property()
  public name?: string;

  @ShipmentMethod.property({type: Address})
  public originAddress?: Address | null;

  @ShipmentMethod.property({type: Company})
  public company?: Company | null;

  @ShipmentMethod.property()
  public companyDefault?: boolean;

  @ShipmentMethod.property({type: Number})
  public defaultCost?: number | null;

  @ShipmentMethod.property({type: Number})
  public maxCost?: number | null;

  @ShipmentMethod.property({type: Number})
  public transportCompany?: number | null;

  @ShipmentMethod.property()
  public currency?: string;

  @ShipmentMethod.property({type: CountryTax})
  public taxType?: CountryTax | null;

  @ShipmentMethod.property({arrayType: 'ShipmentMethodVariation'})
  public variations?: ShipmentMethodVariation[];

  @ShipmentMethod.property({arrayType: 'Product'})
  public products?: Product[];
}
