import { Domain } from './domain';
import { Entity } from '../entity';
import { Product } from './product';
import { User } from './user';

export class Category extends Entity {
  protected static resourceName: string = "categories";
  protected static singularName: string = "category";
  protected static pluralName: string = "categories";

  @Category.property("archived")
  public archived?: Date | null;

  @Category.property("id")
  public id?: number;

  @Category.property("name")
  public name?: string;

  @Category.property("showDashboard")
  public showDashboard?: boolean;

  @Category.property("showPublic")
  public showPublic?: boolean;

  @Category.property("domain")
  public domain?: Domain;

  @Category.property("products", "Product")
  public products?: Array<Product>;

  @Category.property("users", "User")
  public users?: Array<User>;
}
