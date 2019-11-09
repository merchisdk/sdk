import { Domain } from './domain';
import { Entity } from '../entity';
import { User } from './user';

export class Session extends Entity {
  protected static resourceName: string = 'sessions';
  protected static singularName: string = 'session';
  protected static pluralName: string = 'sessions';
  protected static primaryKey: string = 'token';

  @Session.property()
  public archived?: Date | null;

  @Session.property()
  public ip?: string | null;

  @Session.property()
  public token?: string;

  @Session.property()
  public remember?: boolean | null;

  @Session.property()
  public user?: User;

  @Session.property()
  public domain?: Domain | null;
}
