import { Entity } from './entity';

export class InternalTag extends Entity {
  protected static resourceName: string = 'internal_tags';
  protected static singularName: string = 'internalTag';
  protected static pluralName: string = 'internalTags';

  @Property({type: Number})
  public id?: number;

  @Property({type: String})
  public name?: string;

  @Property({type: String})
  public colour?: string;

  @Property({type: String})
  public description?: string;
}
