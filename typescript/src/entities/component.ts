import { ComponentTag } from './component_tag';
import { ComponentVersion } from './component_version';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { User } from './user';

export class Component extends Entity {
  protected static resourceName = 'components';
  protected static singularName = 'component';
  protected static pluralName = 'components';

  @Component.property({type: Date})
  public archived?: Date | null;

  @Component.property({type: Date})
  public created?: Date;

  @Component.property({type: Date})
  public updated?: Date;

  @Component.property()
  public id?: number;

  @Component.property()
  public isClassBased?: boolean;

  @Component.property()
  public outOfSyncWithOriginal?: boolean;

  @Component.property()
  public needsUpdate?: boolean;

  @Component.property()
  public hasImports?: number;

  @Component.property()
  public isClone?: boolean;

  @Component.property()
  public warnings?: boolean;

  @Component.property()
  public name?: string;

  @Component.property()
  public body?: string;

  @Component.property()
  public description?: string;

  @Component.property()
  public compiled?: string;

  @Component.property({type: 'Component'})
  public componentExport?: Component;

  @Component.property({arrayType: 'Component'})
  public componentExports?: Component[];

  @Component.property({arrayType: 'Component'})
  public componentImports?: Component[];

  @Component.property({type: 'Component'})
  public originalComponent?: Component;

  @Component.property({arrayType: 'MerchiFile'})
  public images?: MerchiFile[];

  @Component.property({type: MerchiFile})
  public featureImage?: MerchiFile | null;

  @Component.property({arrayType: 'ComponentTag'})
  public tags?: ComponentTag[];

  @Component.property({type: 'User'})
  public createdBy?: User | null;

  @Component.property({type: 'User'})
  public updatedBy?: User | null;

  @Component.property({arrayType: 'ComponentVersion'})
  public versions?: ComponentVersion[];

  public toReact = (context: any) => {
    const componentCode = 'with (this) { ' + this.compiled + ' return ' +
      this.name + ';}';
    const proxy = new Proxy(context, {});
    const callable = new Function(componentCode);
    return callable.call(proxy);
  };

}
