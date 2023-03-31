import { Entity } from '../entity';
import { Inventory } from './inventory';
import { VariationFieldsOption } from './variation_fields_option';

export class InventoryUnitVariation extends Entity {
  protected static resourceName = 'inventory_unit_variations';
  protected static singularName = 'inventoryUnitVariation';
  protected static pluralName = 'inventoryUnitVariations';

  @InventoryUnitVariation.property({type: Date})
  public archived?: Date | null;

  @InventoryUnitVariation.property()
  public id?: number;

  @InventoryUnitVariation.property()
  public inventory?: Inventory;

  @InventoryUnitVariation.property()
  public variationFieldsOption?: VariationFieldsOption;

  public optionId = () => {
    if (this.variationFieldsOption === undefined) {
      throw new Error(
        'variationFieldsOption is undefined, did you forget to embed it?');
    }
    return this.variationFieldsOption.id;
  };
}
