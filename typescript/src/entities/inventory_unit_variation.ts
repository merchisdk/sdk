import { Entity } from '../entity';
import { Inventory } from './inventory';
import { VariationFieldsOption } from './variation_fields_option';

export class InventoryUnitVariation extends Entity {
  protected static resourceName: string = "inventory_unit_variations";
  protected static singularName: string = "inventoryUnitVariation";
  protected static pluralName: string = "inventoryUnitVariations";

  @InventoryUnitVariation.property("archived")
  public archived?: Date | null;

  @InventoryUnitVariation.property("id")
  public id?: number;

  @InventoryUnitVariation.property("inventory")
  public inventory?: Inventory;

  @InventoryUnitVariation.property("variationFieldsOption")
  public variationFieldsOption?: VariationFieldsOption;
}
