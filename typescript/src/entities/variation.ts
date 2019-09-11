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

  @Variation.property("archived")
  public archived?: Date | null;

  @Variation.property("id")
  public id?: number;

  @Variation.property("value")
  public value?: string | null;

  @Variation.property("cost")
  public cost?: number;

  @Variation.property("quantity")
  public quantity?: number;

  @Variation.property("onceOffCost")
  public onceOffCost?: number;

  @Variation.property("unitCost")
  public unitCost?: number;

  @Variation.property("unitCostTotal")
  public unitCostTotal?: number;

  @Variation.property("variationField")
  public variationField?: VariationField;

  @Variation.property("variationsGroup")
  public variationsGroup?: VariationsGroup | null;

  @Variation.property("job")
  public job?: Job | null;

  @Variation.property("cartItem")
  public cartItem?: CartItem | null;

  @Variation.property("variationFiles", "MerchiFile")
  public variationFiles?: Array<MerchiFile>;

  @Variation.property("selectedOptions", "VariationFieldsOption")
  public selectedOptions?: Array<VariationFieldsOption>;
}
