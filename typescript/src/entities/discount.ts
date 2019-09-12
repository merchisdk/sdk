import { Entity } from '../entity';
import { Product } from './product';

export class Discount extends Entity {
  protected static resourceName: string = "discounts";
  protected static singularName: string = "discount";
  protected static pluralName: string = "discounts";

  @Discount.property("archived")
  public archived?: Date | null;

  @Discount.property("id")
  public id?: number;

  @Discount.property("lowerLimit")
  public lowerLimit?: number;

  @Discount.property("amount")
  public amount?: number;

  @Discount.property("product")
  public product?: Product | null;
}
