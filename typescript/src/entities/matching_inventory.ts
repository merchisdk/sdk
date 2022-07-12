import { Entity } from '../entity';
import { Job } from './job';
import { Inventory } from './inventory';
import { VariationsGroup } from './variations_group';
import { InventoryStatus } from '../constants/inventory_statuses';

export class MatchingInventory extends Entity {
  protected static resourceName = 'matching_inventories';
  protected static singularName = 'matchingInventory';
  protected static pluralName = 'matchingInventories';

  @MatchingInventory.property({type: Date})
  public archived?: Date | null;

  @MatchingInventory.property({type: Date})
  public deductionDate?: Date | null;

  @MatchingInventory.property()
  public job?: Job;

  @MatchingInventory.property({type: 'VariationsGroup'})
  public group?: VariationsGroup | null;

  @MatchingInventory.property({type: Inventory})
  public inventory?: Inventory | null;

  @MatchingInventory.property()
  public status?: InventoryStatus;
}
