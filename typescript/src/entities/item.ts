import { CountryTax } from './country_tax';
import { Entity } from '../entity';
import { Invoice } from './invoice';

export class Item extends Entity {
  protected static resourceName: string = "items";
  protected static singularName: string = "item";
  protected static pluralName: string = "items";

  @Item.property("archived")
  public archived?: Date | null;

  @Item.property("id")
  public id?: number;

  @Item.property("quantity")
  public quantity?: number | null;

  @Item.property("description")
  public description?: string;

  @Item.property("cost")
  public cost?: number;

  @Item.property("taxAmount")
  public taxAmount?: number | null;

  @Item.property("taxType")
  public taxType?: CountryTax | null;

  @Item.property("invoice")
  public invoice?: Invoice | null;
}
