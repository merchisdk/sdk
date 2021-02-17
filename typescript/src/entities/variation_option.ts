import { Entity } from '../entity';

export class VariationOption extends Entity {
  protected static singularName: string = 'variationOption';
  protected static pluralName: string = 'variationOptions';

  @VariationOption.property()
  public optionId?: number;

  @VariationOption.property({type: String})
  public value?: string | null;

  @VariationOption.property({type: String})
  public colour?: string | null;

  @VariationOption.property()
  public fieldName?: string;

  @VariationOption.property()
  public onceOffCost?: number;

  @VariationOption.property()
  public unitCost?: number;

  @VariationOption.property()
  public unitCostTotal?: number;

  @VariationOption.property()
  public totalCost?: number;
}
