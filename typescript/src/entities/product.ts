import { Entity } from '../entity';
import { Category } from './category';
import { Domain } from './domain';

export class Product extends Entity {
  protected static resourceName: string = "products";
  protected static singularName: string = "product";
  protected static pluralName: string = "products";

  @Product.property("id")
  public id?: number;

  @Product.property("name")
  public name?: string;

  @Product.property("categories", "Category")
  public categories?: Array<Category>;

  @Product.property("domain")
  public domain?: Domain;
}
