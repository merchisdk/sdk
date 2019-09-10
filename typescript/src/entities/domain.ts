import { Entity } from '../entity';

export class Domain extends Entity {
  protected static resourceName: string = "domains";
  protected static singularName: string = "domain";
  protected static pluralName: string = "domains";

  @Domain.property("id")
  public id?: number;

  @Domain.property("domain")
  public domain?: string;
}
