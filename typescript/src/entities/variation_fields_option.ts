import { Entity } from '../entity';
import { MerchiFile } from './file';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { Variation } from './variation';
import { VariationField } from './variation_field';

export class VariationFieldsOption extends Entity {
  protected static resourceName: string = "variation_fields_options";
  protected static singularName: string = "variationFieldsOption";
  protected static pluralName: string = "variationFieldsOptions";

  @VariationFieldsOption.property()
  public archived?: Date | null;

  @VariationFieldsOption.property()
  public id?: number;

  @VariationFieldsOption.property()
  public value?: string | null;

  @VariationFieldsOption.property()
  public colour?: string | null;

  @VariationFieldsOption.property()
  public default?: boolean;

  @VariationFieldsOption.property()
  public position?: number;

  @VariationFieldsOption.property()
  public variationCost?: number;

  @VariationFieldsOption.property()
  public variationUnitCost?: number;

  @VariationFieldsOption.property()
  public variationField?: VariationField | null;

  @VariationFieldsOption.property()
  public linkedFile?: MerchiFile | null;

  @VariationFieldsOption.property("Variation")
  public selectedByVariations?: Array<Variation>;

  @VariationFieldsOption.property("InventoryUnitVariation")
  public inventoryUnitVariations?: Array<InventoryUnitVariation>;

  public totalCost = (quantity: number) => {
    if (this.variationCost === undefined) {
      throw new Error("variationCost is unknown");
    }
    if (this.variationUnitCost === undefined) {
      throw new Error("variationUnitCost is unknown");
    }
    return this.variationCost + this.variationUnitCost * quantity;
  }
}
