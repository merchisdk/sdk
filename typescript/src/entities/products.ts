import { Entity } from '../entity';

export class Product extends Entity {
  @Product.property("id")
  private _id?: number;

  get id(): number | undefined {
    return this._id;
  }

  set id(newId: number | undefined) {
    this._id = newId;
    this._isDirty = true;
  }
}
