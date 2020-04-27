import { Address } from './address';
import { Entity } from '../entity';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { Job } from './job';
import { Product } from './product';
import { VariationsGroup } from './variations_group';

export class Inventory extends Entity {
  protected static resourceName: string = 'inventories';
  protected static singularName: string = 'inventory';
  protected static pluralName: string = 'inventories';

  @Inventory.property({type: Date})
  public archived?: Date | null;

  @Inventory.property()
  public id?: number;

  @Inventory.property()
  public quantity?: number;

  @Inventory.property()
  public name?: string;

  @Inventory.property()
  public notes?: string;

  @Inventory.property()
  public product?: Product;

  @Inventory.property({type: Address})
  public address?: Address | null;

  @Inventory.property({arrayType: 'VariationsGroup'})
  public variationsGroups?: VariationsGroup[];

  @Inventory.property({arrayType: 'Job'})
  public jobs?: Job[];

  @Inventory.property({arrayType: 'InventoryUnitVariation'})
  public inventoryUnitVariations?: InventoryUnitVariation[];
}
