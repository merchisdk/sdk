import { Entity } from '../entity';
import { Product } from './product';

export class Category extends Entity {
  protected static resourceName: string = "categories";
  protected static singularName: string = "category";
  protected static pluralName: string = "categories";

  @Category.property("id")
  public id?: number;

  @Category.property("name")
  public name?: string;

  @Category.property("products", "Product")
  public products?: Array<Product> | undefined;
}
