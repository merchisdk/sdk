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

  @Inventory.property("archived")
  public archived?: Date | null;

  @Inventory.property("id")
  public id?: number;

  @Inventory.property("quantity")
  public quantity?: number;

  @Inventory.property("name")
  public name?: string;

  @Inventory.property("notes")
  public notes?: string;

  @Inventory.property("product")
  public product?: Product;

  @Inventory.property("address")
  public address?: Address | null;

  @Inventory.property("variationsGroups", "VariationsGroup")
  public variationsGroups?: Array<VariationsGroup>;

  @Inventory.property("jobs", "Job")
  public jobs?: Array<Job>;

  @Inventory.property("inventoryUnitVariations", "InventoryUnitVariation")
  public inventoryUnitVariations?: Array<InventoryUnitVariation>;
}
