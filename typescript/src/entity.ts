import 'reflect-metadata';
import { apiFetch } from './request';


export class Entity {
  private static jsonNameKey = Symbol('jsonName');
  private static propertiesSetKey = Symbol('propertiesSet')

  protected static resourceName: string;
  protected static singularName: string;

  protected _isDirty: boolean = false;
  // maps json names like 'id' to attribute names like '_id'.
  protected propertiesMap: Map<string, string>;

  protected static property(jsonName: string) {
    return function (target: Entity, propertyKey: string) {
      let properties = Reflect.getMetadata(Entity.propertiesSetKey,
        target.constructor);
      properties = properties || new Set();
      properties.add(propertyKey);
      Reflect.defineMetadata(Entity.propertiesSetKey, properties,
        target.constructor);
      Reflect.defineMetadata(Entity.jsonNameKey, jsonName, target,
        propertyKey);
    };
  }

  protected makePropertiesMap() {
    const map = new Map();
    const self = this;
    const properties = Reflect.getMetadata(Entity.propertiesSetKey,
      this.constructor);
    properties.forEach(function(item: any) {
      const jsonName = Reflect.getMetadata(Entity.jsonNameKey, self, item);
      map.set(jsonName, item);
    }); 
    return map;
  }

  constructor() {
    this.propertiesMap = this.makePropertiesMap();
  }

  public static get<T extends typeof Entity>(this: T, id: number):
     Promise<InstanceType<T>>{
    const resource = `/${this.resourceName}/${String(id)}/`;
    return apiFetch(resource).then((data: any) => {
      const result: InstanceType<T> = (new this()) as InstanceType<T>;
      result.fromJson(data);
      return result;
    });
  }

  public fromJson(json: any) {
    const constructor = this.constructor as typeof Entity;
    const singularName: string = constructor.singularName;
    const data: object = json[singularName];
    for (const key in data) {
      const value: any = (data as any)[key];
      const property = this.propertiesMap.get(key);
      if (property) {
        (this as any)[property] = value;
      }
    }
  }
}
