import { Entity } from '../entity';
import { Product } from './product';

export class Discount extends Entity {
  protected static resourceName: string = "discounts";
  protected static singularName: string = "discount";
  protected static pluralName: string = "discounts";

  @Discount.property()
  public archived?: Date | null;

  @Discount.property()
  public id?: number;

  @Discount.property()
  public lowerLimit?: number;

  @Discount.property()
  public amount?: number;

  @Discount.property()
  public product?: Product | null;
}
