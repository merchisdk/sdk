import { Entity } from '../entity';
import { Theme } from './theme';
import { MenuItem } from './menu_item';

export class Menu extends Entity {
  protected static resourceName = 'menus';
  protected static singularName = 'menu';
  protected static pluralName = 'menus';

  @Menu.property({type: Date})
  public archived?: Date | null;

  @Menu.property()
  public id?: number;

  @Menu.property()
  public name?: string;

  @Menu.property()
  public menuHandle?: string;

  @Menu.property()
  public menuType?: number;

  @Menu.property()
  public theme?: Theme;

  @Menu.property({arrayType: 'MenuItem'})
  public menuItems?: MenuItem[];
}
