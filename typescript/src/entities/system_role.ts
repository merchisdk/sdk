import { Entity } from '../entity';
import { User } from './user';

export class SystemRole extends Entity {
  protected static resourceName: string = "system_roles";
  protected static singularName: string = "systemRole";
  protected static pluralName: string = "systemRoles";

  @SystemRole.property("id")
  public id?: number;

  @SystemRole.property("role")
  public role?: number;

  @SystemRole.property("user")
  public user?: User;
}
