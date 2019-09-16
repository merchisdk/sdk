import { Domain } from './domain';
import { Entity } from '../entity';
import { Product } from './product';

export class SupplyDomain extends Entity {
  protected static resourceName: string = "supply_domains";
  protected static singularName: string = "supplyDomain";
  protected static pluralName: string = "supplyDomains";

  @SupplyDomain.property()
  public archived?: Date | null;

  @SupplyDomain.property()
  public id?: number;

  @SupplyDomain.property()
  public product?: Product;

  @SupplyDomain.property()
  public supplyProduct?: Product | null;

  @SupplyDomain.property()
  public domain?: Domain;
}
