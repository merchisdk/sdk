import { Address } from './address';
import { Entity } from '../entity';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { Job } from './job';
import { Product } from './product';
import { VariationsGroup } from './variations_group';

export class Inventory extends Entity {
  protected static resourceName: string = "inventories";
  protected static singularName: string = "inventory";
  protected static pluralName: string = "inventories";

  @Inventory.property()
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

  @Inventory.property()
  public address?: Address | null;

  @Inventory.property("VariationsGroup")
  public variationsGroups?: Array<VariationsGroup>;

  @Inventory.property("Job")
  public jobs?: Array<Job>;

  @Inventory.property("InventoryUnitVariation")
  public inventoryUnitVariations?: Array<InventoryUnitVariation>;
}
