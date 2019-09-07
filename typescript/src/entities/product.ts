import { Entity } from '../entity';
import { Category } from './category';
import { Domain } from './domain';

export class Product extends Entity {
  protected static resourceName: string = "products";
  protected static singularName: string = "product";
  protected static pluralName: string = "products";

  @Product.property("id")
  private _id?: number;

  get id(): number | undefined {
    return this._id;
  }

  set id(newId: number | undefined) {
    this._id = newId;
    this._isDirty = true;
  }

  @Product.property("name")
  private _name?: string;

  get name(): string | undefined {
    return this._name;
  }

  set name(newName: string | undefined) {
    this._name = newName;
    this._isDirty = true;
  }

  @Product.property("categories", "Category")
  private _categories?: Array<Category>;

  get categories(): Array<Category> | undefined {
    return this._categories;
  }

  set categories(newCategories: Array<Category> | undefined) {
    this._categories = newCategories;
    this._isDirty = true;
    this.checkSameSessionList(newCategories);
  }

  @Product.property("domain")
  private _domain?: Domain;

  get domain(): Domain | undefined {
    return this._domain;
  }

  set domain(newDomain: Domain | undefined) {
    this.checkSameSession(newDomain);
    this._isDirty = true;
    this._domain = newDomain;
  }
}
