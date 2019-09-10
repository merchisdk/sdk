import { Domain } from './domain';
import { Entity } from '../entity';
import { Product } from './product';

export class SupplyDomain extends Entity {
  protected static resourceName: string = "supply_domains";
  protected static singularName: string = "supplyDomain";
  protected static pluralName: string = "supplyDomains";

  @SupplyDomain.property("archived")
  public archived?: Date | null;

  @SupplyDomain.property("id")
  public id?: number;

  @SupplyDomain.property("product")
  public product?: Product;

  @SupplyDomain.property("supplyProduct")
  public supplyProduct?: Product | null;

  @SupplyDomain.property("domain")
  public domain?: Domain;
}
