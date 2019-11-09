import { Entity } from '../entity';
import { Menu } from './menu';

export class MenuItem extends Entity {
  protected static resourceName: string = 'menu_items';
  protected static singularName: string = 'menuItem';
  protected static pluralName: string = 'menuItems';

  @MenuItem.property()
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
