import { Entity } from './entity';
import { Field } from '../field';

export class InternalTag extends Entity {
  protected static resourceName: string = 'internal_tags';
  protected static singularName: string = 'internalTag';
  protected static pluralName: string = 'internalTags';

  public id: number;
  public name: string;
  public description: string;
  
  constructor() {
    super();
    this.id = 0;
    this.name = '';
    this.description = '';
  }
  @Field.d()
  public colour = new Field<string>(this);
  @Field.d()
  public description: string;
}
