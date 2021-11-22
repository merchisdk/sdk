import { ComponentTag } from './component_tag';
import { Entity } from '../entity';
import { MerchiFile } from './file';

export class Component extends Entity {
  protected static resourceName: string = 'components';
  protected static singularName: string = 'component';
  protected static pluralName: string = 'components';

  @Component.property({type: Date})
  public archived?: Date | null;

  @Component.property()
  public id?: number;

  @Component.property()
  public isClassBased?: boolean;

  @Component.property()
  public name?: string;

  @Component.property()
  public body?: string;

  @Component.property()
  public description?: string;

  @Component.property()
  public compiled?: string;

  @Component.property({arrayType: 'MerchiFile'})
  public images?: MerchiFile[];

  @Component.property({type: MerchiFile})
  public featureImage?: MerchiFile | null;

  @Component.property({arrayType: 'ComponentTag'})
  public tags?: ComponentTag[];

  public toReact = (context: any) => {
    const componentCode = 'with (this) { ' + this.compiled + ' return ' +
      this.name + ';}';
    const proxy = new Proxy(context, {});
    const callable = new Function(componentCode);
    return callable.call(proxy);
  }

}
