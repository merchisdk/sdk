import { Entity } from '../entity';
import { Menu } from './menu';

export class MenuItem extends Entity {
  protected static resourceName: string = "menu_items";
  protected static singularName: string = "menuItem";
  protected static pluralName: string = "menuItems";

  @MenuItem.property("archived")
  public archived?: Date | null;

  @MenuItem.property("id")
  public id?: number;

  @MenuItem.property("name")
  public name?: string;

  @MenuItem.property("linkType")
  public linkType?: number;

  @MenuItem.property("linkUri")
  public linkUri?: string;

  @MenuItem.property("position")
  public position?: number;

  @MenuItem.property("menu")
  public menu?: Menu;
}
