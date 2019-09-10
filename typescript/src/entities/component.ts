import { ComponentTag } from './component_tag';
import { Entity } from '../entity';
import { MerchiFile } from './file';

export class Component extends Entity {
  protected static resourceName: string = "components";
  protected static singularName: string = "component";
  protected static pluralName: string = "components";

  @Component.property("archived")
  public archived?: Date | null;

  @Component.property("id")
  public id?: number;

  @Component.property("name")
  public name?: string;

  @Component.property("body")
  public body?: string;

  @Component.property("description")
  public description?: string;

  @Component.property("compiled")
  public compiled?: string;

  @Component.property("images", "MerchiFile")
  public images?: Array<MerchiFile>;

  @Component.property("featureImage")
  public featureImage?: MerchiFile | null;

  @Component.property("tags", "ComponentTag")
  public tags?: Array<ComponentTag>;
}
