import { Entity } from '../entity';
import { Product } from './product';
import { Discount } from './discount';

export class DiscountGroup extends Entity {
  protected static resourceName: string = 'discountGroups';
  protected static singularName: string = 'discountGroup';
  protected static pluralName: string = 'discountGroups';

  @DiscountGroup.property({type: Date})
  public archived?: Date | null;

  @DiscountGroup.property()
  public id?: number;

  @DiscountGroup.property()
  public discountType?: number;

  @DiscountGroup.property({arrayType: 'Discount'})
  public discounts?: Discount[];

  @DiscountGroup.property()
  public name?: string;

  @DiscountGroup.property({type: 'Product'})
  public product?: Product | null;

}
