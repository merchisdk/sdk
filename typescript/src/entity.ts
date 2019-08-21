import 'reflect-metadata';


export abstract class Entity {
  private static jsonNameKey = Symbol('jsonName');
  private static propertiesSetKey = Symbol('propertiesSet')

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

  protected makePropertiesMap () {
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
}
