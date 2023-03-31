import { Entity } from '../entity';
import { DiscountGroup } from './discount_group';

export class Discount extends Entity {
  protected static resourceName = 'discounts';
  protected static singularName = 'discount';
  protected static pluralName = 'discounts';

  @Discount.property({type: Date})
  public archived?: Date | null;

  @Discount.property()
  public id?: number;

  @Discount.property()
  public lowerLimit?: number;

  @Discount.property()
  public amount?: number;

  @Discount.property({type: DiscountGroup})
  public discountGroup?: DiscountGroup | null;

  public discountedUnitCost = (unitPrice: number | undefined) => {
    if (unitPrice === undefined) {
      throw 'unitPrice is undefined, did you forget to embed it?';
    }
    if (this.amount === undefined) {
      throw 'amount is undefined, did you forget to embed it?';
    }
    const discount = 100 - this.amount;
    return (unitPrice * discount / 100).toFixed(3);
  };
}
