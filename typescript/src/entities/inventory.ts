import { Address } from './address';
import { Entity } from '../entity';
import { InventoryUnitVariation } from './inventory_unit_variation';
import { Job } from './job';
import { Product } from './product';
import { VariationsGroup } from './variations_group';
import { VariationFieldsOption } from './variation_fields_option';
import { some } from 'lodash';

export class Inventory extends Entity {
  protected static resourceName = 'inventories';
  protected static singularName = 'inventory';
  protected static pluralName = 'inventories';

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
  public isOrphan?: boolean;

  @Inventory.property({arrayType: 'Product'})
  public products?: Product[];

  @Inventory.property({type: Address})
  public address?: Address | null;

  @Inventory.property({arrayType: 'VariationsGroup'})
  public variationsGroups?: VariationsGroup[];

  @Inventory.property({arrayType: 'Job'})
  public jobs?: Job[];

  @Inventory.property({arrayType: 'InventoryUnitVariation'})
  public inventoryUnitVariations?: InventoryUnitVariation[];

  public isVariationFieldOptionSelected = (option: VariationFieldsOption) => {
    if (this.inventoryUnitVariations === undefined) {
      throw new Error(
        'inventoryUnitVariations is undefined, did you forget to embed it?');
    }
    return some(this.inventoryUnitVariations.map(
      (v: InventoryUnitVariation) => v.optionId() === option.id));
  };
}
