import { Entity } from '../entity';

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
    this._isDirty = true;
  }

  @Category.property("name")
  private _name?: string;

  get name(): string | undefined {
    return this._name;
  }

  set name(newName: string | undefined) {
    this._name = newName;
    this._isDirty = true;
  }
}
