import { Domain } from './domain';
import { Entity } from '../entity';
import { Product } from './product';
import { User } from './user';

export class Category extends Entity {
  protected static resourceName: string = "categories";
  protected static singularName: string = "category";
  protected static pluralName: string = "categories";

  @Category.property()
  public archived?: Date | null;

  @Category.property()
  public id?: number;

  @Category.property()
  public name?: string;

  @Category.property()
  public showDashboard?: boolean;

  @Category.property()
  public showPublic?: boolean;

  @Category.property()
  public domain?: Domain;

  @Category.property("Product")
  public products?: Array<Product>;

  @Category.property("User")
  public users?: Array<User>;
}
