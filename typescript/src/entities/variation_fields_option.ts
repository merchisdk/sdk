import { DiscountGroup } from './discount_group';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { Variation } from './variation';
import { VariationField } from './variation_field';

export class VariationFieldsOption extends Entity {
  protected static resourceName: string = 'variation_fields_options';
  protected static singularName: string = 'variationFieldsOption';
  protected static pluralName: string = 'variationFieldsOptions';

  @VariationFieldsOption.property({type: Date})
  public archived?: Date | null;

  @VariationFieldsOption.property()
  public id?: number;

  @VariationFieldsOption.property({type: String})
  public value?: string | null;

  @VariationFieldsOption.property({type: String})
  public colour?: string | null;

  @VariationFieldsOption.property()
  public currency?: string;

  @VariationFieldsOption.property()
  public default?: boolean;

  @VariationFieldsOption.property()
  public position?: number;

  @VariationFieldsOption.property()
  public variationCost?: number;

  @VariationFieldsOption.property({type: 'DiscountGroup'})
  public variationCostDiscountGroup?: DiscountGroup;

  @VariationFieldsOption.property()
  public variationUnitCost?: number;

  @VariationFieldsOption.property({type: 'DiscountGroup'})
  public variationUnitCostDiscountGroup?: DiscountGroup;

  @VariationFieldsOption.property({type: VariationField})
  public variationField?: VariationField | null;

  @VariationFieldsOption.property({type: MerchiFile})
  public linkedFile?: MerchiFile | null;

  @VariationFieldsOption.property({arrayType: 'Variation'})
  public selectedByVariations?: Variation[];

  @VariationFieldsOption.property({arrayType: 'InventoryUnitVariation'})
  public inventoryUnitVariations?: InventoryUnitVariation[];

  public totalCost = (quantity: number) => {
    if (this.variationCost === undefined) {
      throw new Error('variationCost is unknown');
    }
    if (this.variationUnitCost === undefined) {
      throw new Error('variationUnitCost is unknown');
    }
    return this.variationCost + this.variationUnitCost * quantity;
  }
}
