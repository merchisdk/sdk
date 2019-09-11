import { Domain } from './domain';
import { Entity } from '../entity';
import { User } from './user';

export class Session extends Entity {
  protected static resourceName: string = "sessions";
  protected static singularName: string = "session";
  protected static pluralName: string = "sessions";

  @Session.property("archived")
  public archived?: Date | null;

  @Session.property("ip")
  public ip?: string | null;

  @Session.property("token", undefined, {isPrimaryKey: true})
  public token?: string;

  @Session.property("remember")
  public remember?: boolean | null;

  @Session.property("user")
  public user?: User;

  @Session.property("domain")
  public domain?: Domain | null;
}
