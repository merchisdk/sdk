import { Domain } from './domain';
import { Entity } from '../entity';
import { MenuItem } from './menu_item';

export class Menu extends Entity {
  protected static resourceName: string = "menus";
  protected static singularName: string = "menu";
  protected static pluralName: string = "menus";

  @Menu.property("archived")
  public archived?: Date | null;

  @Menu.property("id")
  public id?: number;

  @Menu.property("name")
  public name?: string;

  @Menu.property("menuHandle")
  public menuHandle?: string;

  @Menu.property("menuType")
  public menuType?: number;

  @Menu.property("domain")
  public domain?: Domain;

  @Menu.property("menuItems", "MenuItem")
  public menuItems?: Array<MenuItem>;
}
