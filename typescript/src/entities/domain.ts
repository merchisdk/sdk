import { Entity } from '../entity';

export class Domain extends Entity {
  protected static resourceName: string = "domains";
  protected static singularName: string = "domain";
  protected static pluralName: string = "domains";

  @Domain.property("id")
  private _id?: number;

  get id(): number | undefined {
    return this._id;
  }

  set id(newId: number | undefined) {
    this._id = newId;
    this._isDirty = true;
  }

  @Domain.property("domain")
  private _domain?: string;

  get domain(): string | undefined {
    return this._domain;
  }

  set domain(newDomain: string | undefined) {
    this._domain = newDomain;
    this._isDirty = true;
  }
}
