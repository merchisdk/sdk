import { Entity } from './entity';
import { Field } from './field';

export class InternalTag extends Entity {
  protected static resourceName: string = 'internal_tags';
  protected static singularName: string = 'internalTag';
  protected static pluralName: string = 'internalTags';

  @Field.d({readonly: true})
  public id: number;
  @Field.d()
  public name: string;
  @Field.d()
  public colour = new Field<string>(this);
  @Field.d()
  public description: string;
}
