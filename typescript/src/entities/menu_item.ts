import { Entity } from '../entity';
import { Menu } from './menu';

export class MenuItem extends Entity {
  protected static resourceName = 'menu_items';
  protected static singularName = 'menuItem';
  protected static pluralName = 'menuItems';

  @MenuItem.property({type: Date})
  public archived?: Date | null;

  @MenuItem.property()
  public id?: number;

  @MenuItem.property()
  public name?: string;

  @MenuItem.property()
  public linkType?: number;

  @MenuItem.property()
  public linkUri?: string;

  @MenuItem.property()
  public position?: number;

  @MenuItem.property()
  public menu?: Menu;
}
