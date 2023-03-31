import { Domain } from './domain';
import { Entity } from '../entity';
import { Product } from './product';

export class SupplyDomain extends Entity {
  protected static resourceName = 'supply_domains';
  protected static singularName = 'supplyDomain';
  protected static pluralName = 'supplyDomains';

  @SupplyDomain.property({type: Date})
  public archived?: Date | null;

  @SupplyDomain.property()
  public id?: number;

  @SupplyDomain.property()
  public needsDrafting?: boolean;

  @SupplyDomain.property()
  public product?: Product;

  @SupplyDomain.property({type: Product})
  public supplyProduct?: Product | null;

  @SupplyDomain.property()
  public domain?: Domain;
}
