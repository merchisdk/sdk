import { Entity } from '../entity';
import { Product } from './product';

export class Category extends Entity {
  protected static resourceName: string = "categories";
  protected static singularName: string = "category";
  protected static pluralName: string = "categories";

  @Category.property("id")
  private _id?: number;

  get id(): number | undefined {
    return this._id;
  }

  set id(newId: number | undefined) {
    this._id = newId;
    this.markDirty("id", newId);
  }

  @Category.property("name")
  private _name?: string;

  get name(): string | undefined {
    return this._name;
  }

  set name(newName: string | undefined) {
    this._name = newName;
    this.markDirty("name", newName);
  }

  @Category.property("products", "Product")
  private _products?: Array<Product> | undefined;

  get products(): Array<Product> | undefined {
    return this._products;
  }

  set products(newProducts: Array<Product> | undefined) {
    this._products = newProducts;
    this.checkSameSessionList(newProducts);
    this.addBackObjectList(newProducts);
    this.markDirty("products", newProducts);
  }
}
