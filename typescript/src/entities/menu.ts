import { Domain } from './domain';
import { Entity } from '../entity';
import { MenuItem } from './menu_item';

export class Menu extends Entity {
  protected static resourceName: string = "menus";
  protected static singularName: string = "menu";
  protected static pluralName: string = "menus";

  @Menu.property()
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
  public domain?: Domain;

  @Menu.property("MenuItem")
  public menuItems?: Array<MenuItem>;
}
