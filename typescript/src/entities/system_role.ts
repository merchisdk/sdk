import { Entity } from '../entity';
import { User } from './user';

export class SystemRole extends Entity {
  protected static resourceName: string = "system_roles";
  protected static singularName: string = "systemRole";
  protected static pluralName: string = "systemRoles";

  @SystemRole.property()
  public id?: number;

  @SystemRole.property()
  public role?: number;

  @SystemRole.property()
  public user?: User;
}
