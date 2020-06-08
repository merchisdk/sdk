import { Entity } from '../entity';
import { Job } from './job';
import { VariationsGroup } from './variations_group';
import { Inventory } from './inventory';
import { InventoryStatus } from '../constants/inventory_statuses'

export class MatchingInventory extends Entity {
  protected static resourceName: string = 'matching_inventories';
  protected static singularName: string = 'matching_inventory';
  protected static pluralName: string = 'matching_inventories';

  @MatchingInventory.property({type: Date})
  public archived?: Date | null;

  @Inventory.property({type: Date})
  public deductionDate?: Date | null;

  @Inventory.property()
  public job?: Job;

  @Inventory.property({type: VariationsGroup})
  public group?: VariationsGroup | null;

  @Inventory.property({type: Inventory})
  public inventory?: Inventory | null;

  @Job.property()
  public canDeduct?: InventoryStatus;
}
