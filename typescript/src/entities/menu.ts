import { Entity } from '../entity';
import { Theme } from './theme';
import { MenuItem } from './menu_item';

export class Menu extends Entity {
  protected static resourceName: string = 'menus';
  protected static singularName: string = 'menu';
  protected static pluralName: string = 'menus';

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
