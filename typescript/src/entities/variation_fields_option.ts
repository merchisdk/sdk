import { Entity } from '../entity';
import { MerchiFile } from './file';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { Variation } from './variation';
import { VariationField } from './variation_field';

export class VariationFieldsOption extends Entity {
  protected static resourceName: string = "variation_fields_options";
  protected static singularName: string = "variationFieldsOption";
  protected static pluralName: string = "variationFieldsOptions";

  @VariationFieldsOption.property("archived")
  public archived?: Date | null;

  @VariationFieldsOption.property("id")
  public id?: number;

  @VariationFieldsOption.property("value")
  public value?: string | null;

  @VariationFieldsOption.property("colour")
  public colour?: string | null;

  @VariationFieldsOption.property("default")
  public default?: boolean;

  @VariationFieldsOption.property("position")
  public position?: number;

  @VariationFieldsOption.property("variationCost")
  public variationCost?: number;

  @VariationFieldsOption.property("variationUnitCost")
  public variationUnitCost?: number;

  @VariationFieldsOption.property("variationField")
  public variationField?: VariationField | null;

  @VariationFieldsOption.property("linkedFile")
  public linkedFile?: MerchiFile | null;

  @VariationFieldsOption.property("selectedByVariations", "Variation")
  public selectedByVariations?: Array<Variation>;

  @VariationFieldsOption.property("inventoryUnitVariations", "InventoryUnitVariation")
  public inventoryUnitVariations?: Array<InventoryUnitVariation>;
}
