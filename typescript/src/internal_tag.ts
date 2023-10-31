import { Entity } from './entity';
import { addField } from './model';

class InternalTag extends Entity {
  protected static resourceName: string = 'internal_tags';
  protected static singularName: string = 'internalTag';
  protected static pluralName: string = 'internalTags';

  @addField('id', 'Number')
  public id: number;

  @addField('name', 'String')
  public name: string;

  @addField('description', 'String')
  public description: string;

  @addField('colour', 'String')
  public colour: string;
}

export { InternalTag };
