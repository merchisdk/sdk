import { CartItem } from './cart_item';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { VariationField } from './variation_field';
import { VariationOption } from './variation_option';
import { VariationsGroup } from './variations_group';

export class Variation extends Entity {
  protected static resourceName = 'variations';
  protected static singularName = 'variation';
  protected static pluralName = 'variations';

  @Variation.property({type: Date})
  public archived?: Date | null;

  @Variation.property()
  public id?: number;

  @Variation.property({type: String})
  public value?: string | null;

  @Variation.property()
  public currency?: string;

  @Variation.property()
  public cost?: number;

  @Variation.property()
  public quantity?: number;

  @Variation.property()
  public onceOffCost?: number;

  @Variation.property()
  public unitCost?: number;

  @Variation.property()
  public unitCostTotal?: number;

  @Variation.property()
  public variationField?: VariationField;

  @Variation.property({type: VariationsGroup})
  public variationsGroup?: VariationsGroup | null;

  @Variation.property({type: Job})
  public job?: Job | null;

  @Variation.property({type: CartItem})
  public cartItem?: CartItem | null;

  @Variation.property({arrayType: 'MerchiFile'})
  public variationFiles?: MerchiFile[];

  @Variation.property({arrayType: 'VariationOption'})
  public selectedOptions?: VariationOption[];

  @Variation.property({arrayType: 'VariationOption'})
  public selectableOptions?: VariationOption[];
}
