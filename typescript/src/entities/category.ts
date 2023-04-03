import { Domain } from './domain';
import { Entity } from '../entity';
import { Product } from './product';
import { User } from './user';

export class Category extends Entity {
  protected static resourceName = 'categories';
  protected static singularName = 'category';
  protected static pluralName = 'categories';

  @Category.property({type: Date})
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
  public showPublicSupplierResell?: boolean;

  @Category.property()
  public domain?: Domain;

  @Category.property({arrayType: 'Product'})
  public products?: Product[];

  @Category.property({arrayType: 'User'})
  public users?: User[];
}
