import { CartItem } from './cart_item';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Job } from './job';
import { VariationField } from './variation_field';
import { VariationFieldsOption } from './variation_fields_option';
import { VariationsGroup } from './variations_group';

export class Variation extends Entity {
  protected static resourceName: string = "variations";
  protected static singularName: string = "variation";
  protected static pluralName: string = "variations";

  @Variation.property()
  public archived?: Date | null;

  @Variation.property()
  public id?: number;

  @Variation.property()
  public value?: string | null;

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

  @Variation.property()
  public variationsGroup?: VariationsGroup | null;

  @Variation.property()
  public job?: Job | null;

  @Variation.property()
  public cartItem?: CartItem | null;

  @Variation.property({arrayType: "MerchiFile"})
  public variationFiles?: Array<MerchiFile>;

  @Variation.property({arrayType: "VariationFieldsOption"})
  public selectedOptions?: Array<VariationFieldsOption>;
}
