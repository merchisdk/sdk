import 'reflect-metadata';
// eslint-disable-next-line no-unused-vars
import { RequestOptions } from './request';
// eslint-disable-next-line no-unused-vars
import { Merchi } from './merchi';

interface EmbedDescriptor {
  [property: string]: {} | EmbedDescriptor;
}

interface GetOptions {
  embed?: EmbedDescriptor;
  includeArchived?: boolean;
  withRights?: boolean;
}

interface ListOptions {
  embed?: EmbedDescriptor;
}

interface ListMetadata {
  canCreate?: boolean;
  available: number;
  count: number;
  limit: number;
  offset: number;
}

interface ListResponse<T> {
  items: Array<T>,
  metadata: ListMetadata,
}

interface SerialiseOptions {
  existing?: FormData;
  excludeOld?: boolean;
  files?: Array<any>;
  prefix?: string;
}

interface PropertyInfo {
  property: string;  // this is the json name, e.g. 'id'
  attribute: string;  // this is the js attribute name, e.g. '_id'
  type: Function;  // e.g. Number
  arrayType?: Entity;  // if type is an array, arrayType is the element type
}

export class Entity {
  private static jsonNameKey = Symbol('jsonName');
  private static arrayTypeKey = Symbol('arrayType');
  private static propertiesSetKey = Symbol('propertiesSet')

  protected static resourceName: string;
  protected static singularName: string;
  protected static pluralName: string;

  // this will be set by the parent Merchi object
  public merchi!: Merchi;

  protected _isDirty: boolean = false;
  // maps json names like 'id' to information about that property
  public propertiesMap: Map<string, PropertyInfo>;

  public get isDirty(): boolean {
    return this._isDirty;
  }

  protected static property(jsonName: string, arrayType?: string) {
    return function (target: Entity, propertyKey: string) {
      let properties = Reflect.getMetadata(Entity.propertiesSetKey,
        target.constructor);
      properties = properties || new Set();
      properties.add(propertyKey);
      Reflect.defineMetadata(Entity.propertiesSetKey, properties,
        target.constructor);
      Reflect.defineMetadata(Entity.jsonNameKey, jsonName, target,
        propertyKey);
      Reflect.defineMetadata(Entity.arrayTypeKey, arrayType, target,
        propertyKey);
    };
  }

  protected makePropertiesMap() {
    const map = new Map();
    const self = this;
    const properties = Reflect.getMetadata(Entity.propertiesSetKey,
      this.constructor);
    properties.forEach(function(attributeName: any) {
      const jsonName = Reflect.getMetadata(Entity.jsonNameKey, self,
        attributeName);
      const propertyType = Reflect.getMetadata('design:type', self,
        attributeName);
      // the array type is needed because 'design:type' breaks down
      // with recursive classes, and also, does not contain the type
      // of an arrays elements, which we need
      const arrayType = Reflect.getMetadata(Entity.arrayTypeKey, self,
        attributeName);
      if (arrayType === undefined) {
        /* istanbul ignore next */
        if (propertyType === Object) {
          /* istanbul ignore next */
          throw new Error('array properties must have an arrayType');
        }
      } else {
        /* istanbul ignore next */
        if (propertyType !== Object && propertyType !== Array) {
          /* istanbul ignore next */
          throw new Error('array type can only be given for arrays');
        }
      }

      const propertyInfo = {property: jsonName,
        attribute: attributeName,
        type: propertyType,
        arrayType: self.getEntityClass(arrayType)};
      map.set(jsonName, propertyInfo);
    }); 
    return map;
  }

  constructor() {
    this.propertiesMap = this.makePropertiesMap();
  }

  public static get<T extends typeof Entity>(this: T, id: number,
    options?: GetOptions):
     Promise<InstanceType<T>>{
    const resource = `/${this.resourceName}/${String(id)}/`;
    const fetchOptions: RequestOptions = {};
    fetchOptions.query = [];
    if (options && options.embed) {
      fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
    }
    if (options && options.includeArchived) {
      fetchOptions.query.push(['include_archived', 'true']);
    }
    if (!(options && options.withRights)) {
      fetchOptions.query.push(['skip_rights', 'y']);
    }
    return this.prototype.merchi.authenticatedFetch(resource, fetchOptions).
      then((data: any) => {
        const result: InstanceType<T> = (new this()) as InstanceType<T>;
        result.fromJson(data);
        return result;
      });
  }

  public static list<T extends typeof Entity>(this: T, options?: ListOptions):
      Promise<ListResponse<InstanceType<T>>> {
    const resource = `/${this.resourceName}/`;
    const fetchOptions: RequestOptions = {};
    if (options && options.embed) {
      fetchOptions.query = [['embed', JSON.stringify(options.embed)]];
    }
    return this.prototype.merchi.authenticatedFetch(resource, fetchOptions).then((data: any) => {
      const metadata = {canCreate: data.canCreate,
        available: data.available,
        count: data.count,
        limit: data.limit,
        offset: data.offset};
      const pluralName = this.pluralName;
      const items: Array<object> = data[pluralName];
      const entities = [];
      for (let item of items) {
        const entity: InstanceType<T> = (new this()) as InstanceType<T>;
        entity.fromJson(item);
        entities.push(entity);
      }
      return {items: entities,
        metadata: metadata};
    });
  }

  public save = () => {
    const primaryKey: number = (this as any).id;
    const resourceName:string = (this.constructor as any).resourceName;
    const resource = `/${resourceName}/${String(primaryKey)}/`;
    const data = this.toFormData();
    const fetchOptions = {method: 'PATCH',
      body: data};
    return this.merchi.authenticatedFetch(resource, fetchOptions).then((data: any) => {
      this.fromJson(data);
      return this;
    });
  };

  private getEntityClass = (name: string) => {
    return (this.merchi as any)[name];
  }

  protected checkSameSession = (other?: Entity) => {
    /* istanbul ignore next */
    if (other !== undefined && other.merchi !== this.merchi) {
      /* istanbul ignore next */
      throw new Error('cannot mix objects from different sessions');
    }
  };

  protected checkSameSessionList = (other?: Array<Entity>) =>  {
    if (other !== undefined) {
      other.map(this.checkSameSession);
    }
  };

  public fromJson = (json: any) => {
    const constructor = this.constructor as typeof Entity;
    const singularName: string = constructor.singularName;
    const data: object = json[singularName];
    for (const key in data) {
      const value: any = (data as any)[key];
      const propertyInfo = this.propertiesMap.get(key);
      if (propertyInfo !== undefined) {
        const attributeName: string = propertyInfo.attribute;
        if (propertyInfo.arrayType) {
          const nestedName = (propertyInfo.arrayType as any).singularName;
          const array = [];
          for (const item of value) {
            const nested = new (propertyInfo.arrayType as any)();
            const itemData: any = {};
            itemData[nestedName] = item;
            nested.fromJson(itemData);
            array.push(nested);
          }
          (this as any)[attributeName] = array;
        } else {
          (this as any)[attributeName] = value;
        }
      }
    }
  }

  protected forEachProperty = (fn: (i: PropertyInfo) => void) => {
    for (const info of this.propertiesMap.values()) {
      fn(info);
    }
  }

  public toFormData = (options?: SerialiseOptions): FormData => {
    options = options || {};
    const result = options.existing || new FormData();
    const prefix = options.prefix || '';
    const appendData = (name: string, value: any) => {
      /* istanbul ignore next */
      if (name === undefined || value === undefined) {
        /* istanbul ignore next */
        return;
      }
      if (prefix) {
        name = prefix + '-' + name;
      }
      result.set(name, value);
    };
    const processArrayProperty = (info: PropertyInfo, value: Array<Entity>) => {
      const remoteCount = value.length;
      const initialLength = Array.from((result as any).entries()).length;
      for (let i = 0; i < remoteCount; ++i) {
        let innerPrefix = info.property + '-' + i;
        if (prefix) {
          innerPrefix = prefix + '-' + innerPrefix;
        }
        value[i].toFormData({existing: result, prefix: innerPrefix});
      }
      const finalLength = Array.from((result as any).entries()).length;
      if ((finalLength - initialLength) > 0) {
        appendData(info.property + '-count', remoteCount);
      }
    };
    const processSingleEntityProperty = (info: PropertyInfo, value: Entity) => {
      let innerPrefix = info.property + '-0';
      if (prefix) {
        innerPrefix = prefix + '-' + innerPrefix;
      }
      const initialLength = Array.from((result as any).entries()).length;
      value.toFormData({existing: result, prefix: innerPrefix});
      const finalLength = Array.from((result as any).entries()).length;
      if ((finalLength - initialLength) > 0) {
        appendData(info.property + '-count', 1);
      }
    };
    const processScalarProperty = (info: PropertyInfo, value: any) => {
      appendData(info.property, value);
    };
    const processProperty = (info: PropertyInfo) => {
      const value = (this as any)[info.attribute];
      if (value === undefined) {
        return;
      } else if (info.arrayType) {
        processArrayProperty(info, value);
      } else if (info.type.prototype.merchi === this.merchi) {
        processSingleEntityProperty(info, value);
      } else {
        processScalarProperty(info, value);
      }
    };
    this.forEachProperty(processProperty);
    return result;
  }
}
