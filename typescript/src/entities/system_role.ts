import { Entity } from '../entity';
import { User } from './user';

export class SystemRole extends Entity {
  protected static resourceName = 'system_roles';
  protected static singularName = 'systemRole';
  protected static pluralName = 'systemRoles';

  @SystemRole.property()
  public id?: number;

  @SystemRole.property()
  public role?: number;

  @SystemRole.property()
  public user?: User;
}
