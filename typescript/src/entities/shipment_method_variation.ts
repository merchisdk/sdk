import { Entity } from '../entity';
import { CountryTax } from './country_tax';
import { ShipmentMethod } from './shipment_method';

export class ShipmentMethodVariation extends Entity {
  protected static resourceName: string = "shipment_method_variations";
  protected static singularName: string = "shipmentMethodVariation";
  protected static pluralName: string = "shipmentMethodVariations";

  @ShipmentMethodVariation.property()
  public id?: number;

  @ShipmentMethodVariation.property({type: String})
  public destinationCountry?: string | null;

  @ShipmentMethodVariation.property({type: String})
  public destinationState?: string | null;

  @ShipmentMethodVariation.property({type: Number})
  public cost?: number | null;

  @ShipmentMethodVariation.property()
  public currency?: string;

  @ShipmentMethodVariation.property({type: Number})
  public maxWeight?: number | null;

  @ShipmentMethodVariation.property({type: "CountryTax"})
  public taxType?: CountryTax | null;

  @ShipmentMethodVariation.property()
  public shipmentMethod?: ShipmentMethod;
}
