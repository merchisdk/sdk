import 'reflect-metadata';
// eslint-disable-next-line no-unused-vars
import { RequestOptions } from './request';
// eslint-disable-next-line no-unused-vars
import { Merchi } from './merchi';
// eslint-disable-next-line no-unused-vars
import { NotificationType } from './constants/notification_types';
// eslint-disable-next-line no-unused-vars
import { NotificationSection } from './constants/notification_sections';
// eslint-disable-next-line no-unused-vars
import { Role } from './constants/roles';

function toUnixTimestamp(date: Date) {
  return parseInt(String(date.getTime() / 1000)).toFixed(0);
}

interface PropertyOptions {
  embeddedByDefault?: boolean;
  jsonName?: string;
  arrayType?: string;
}

interface EmbedDescriptor {
  [property: string]: {} | EmbedDescriptor;
}

interface SaveOptions {
  withRights?: boolean;
}

interface DeleteOptions {
  withRights?: boolean;
}

interface GetOptions {
  embed?: EmbedDescriptor;
  includeArchived?: boolean;
  withRights?: boolean;
}

export enum SortOrder {
  // eslint-disable-next-line no-unused-vars
  ASCENDING,
  // eslint-disable-next-line no-unused-vars
  DESCENDING
}

interface ListOptions {
  embed?: EmbedDescriptor;
  offset?: number;
  limit?: number;
  q?: string;
  sort?: string;
  order?: SortOrder;
  tab?: string;
  as?: string;
  withRights?: boolean; 
  state?: string;
  categoryId?: number;
  inDomain?: number;
  inDomainRoles?: Array<number>;
  asRole?: Role;
  publicOnly?: boolean; 
  managedOnly?: boolean;
  memberOnly?: boolean;
  domainRoles?: Array<Role>;
  managedDomainsOnly?: boolean;
  businessDomainsOnly?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  relatedJob?: number;
  relatedProduct?: number;
  jobNotifiable?: number;
  notificationType?: NotificationType;
  notificationRecipient?: number;
  notificationJob?: number;
  relatedUser?: number;
  clientId?: number;
  clientCompanyId?: number;
  savedByUser?: number;
  receiverId?: number;
  companyId?: number;
  componentId?: number;
  section?: NotificationSection;
  senderRole?: Role;
  isOrder?: boolean;
  tags?: Array<number>;
  exclude?: Array<number>;
}

interface ListMetadata {
  canCreate?: boolean;
  available: number;
  count: number;
  limit: number;
  offset: number;
}

export interface ListResponse<T> {
  items: Array<T>,
  metadata: ListMetadata,
}

interface SerialiseOptions {
  existing?: FormData;
  excludeOld?: boolean;
  _prefix?: string;
  _fileIndex?: number;
}

interface PropertyInfo {
  property: string;  // this is the json name, e.g. 'id'
  attribute: string;  // this is the js attribute name, e.g. '_id'
  type: Function;  // e.g. Number
  arrayType?: Entity;  // if type is an array, arrayType is the element type
  dirty: boolean;  // true if out of date with server
  currentValue?: any;  // type is actually `this.type | undefined`
  embeddedByDefault: boolean;
}

export class Entity {
  private static jsonNameKey = Symbol('jsonName');
  private static arrayTypeKey = Symbol('arrayType');
  private static extraOptionsKey = Symbol('extraOptions');
  private static propertiesSetKey = Symbol('propertiesSet')

  protected static resourceName: string;
  protected static singularName: string;
  protected static pluralName: string;
  protected static primaryKey: string = 'id';

  // these will be set by the parent Merchi object
  public merchi!: Merchi;
  public static merchi: Merchi;

  public isDirty: boolean = false;
  // maps json names like 'id' to information about that property
  public propertiesMap: Map<string, PropertyInfo>;
  public readonly backObjects: Set<Entity> = new Set();

  protected static property(options?: PropertyOptions) {
    return function (target: Entity, propertyKey: string) {
      if (!options) {
        options = {};
      }
      const arrayType = options.arrayType;
      const jsonName = options.jsonName || propertyKey;
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
      Reflect.defineMetadata(Entity.extraOptionsKey, options, target,
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
      const realArrayType = self.getEntityClass(arrayType);
      const options: PropertyOptions =
         Reflect.getMetadata(Entity.extraOptionsKey, self, attributeName);
      if (arrayType !== undefined) {
        /* istanbul ignore next */
        if (propertyType !== Object && propertyType !== Array) {
          /* istanbul ignore next */
          throw new Error('array type can only be given for arrays');
        }
      }
      const normallyEmbeddedByDefault = !(realArrayType || 
        propertyType.prototype instanceof Entity);
      const embeddedByDefault = options.embeddedByDefault !== undefined ?
        options.embeddedByDefault : normallyEmbeddedByDefault;
      const propertyInfo = {property: jsonName,
        attribute: attributeName,
        type: propertyType,
        arrayType: realArrayType,
        embeddedByDefault: embeddedByDefault,
        dirty: true};
      map.set(jsonName, propertyInfo);
    }); 
    return map;
  }

  constructor(merchi?: Merchi) {
    /* istanbul ignore next */
    if (merchi !== undefined) {
      this.merchi = merchi;
    }
    this.propertiesMap = this.makePropertiesMap();
    this.setupProperties();
  }

  public getPrimaryKeyValue = () => {
    const name: string = (this.constructor as typeof Entity).primaryKey;
    const info = this.propertiesMap.get(name);
    /* istanbul ignore next */
    if (info !== undefined) {
      return info.currentValue;
    }
    /* istanbul ignore next */
    return undefined;
  }

  private setupProperties = () => {
    const properties: any = {};
    const makeSetSingle = (info: PropertyInfo) => {
      const get = () => {
        return info.currentValue;
      };
      const set = (newValue?: Entity) => {
        this.checkSameSession(newValue);
        info.currentValue = newValue;
        this.addBackObject(newValue);
        this.markDirty(info.property, newValue);
      };
      return { get: get,
        set: set};
    };
    const makeSetScalar = (info: PropertyInfo) => {
      const get = () => {
        return info.currentValue;
      };
      const set = (newValue: any) => {
        info.currentValue = newValue;
        this.markDirty(info.property, newValue);
      };
      return { get: get,
        set: set};
    };
    const makeSetArray = (info: PropertyInfo) => {
      const get = () => {
        return info.currentValue;
      };
      const set = (newValue?: Array<Entity>) => {
        info.currentValue = newValue;
        this.checkSameSessionList(newValue);
        this.addBackObjectList(newValue);
        this.markDirty(info.property, newValue);
      };
      return { get: get,
        set: set}; 
    };
    for (const info of this.propertiesMap.values()) {
      if (info.type.prototype instanceof Entity) {
        properties[info.attribute] = makeSetSingle(info);
      } else if (info.arrayType) {
        properties[info.attribute] = makeSetArray(info);
      } else {
        properties[info.attribute] = makeSetScalar(info);
      }
    }
    Object.defineProperties(this, properties);
  }

  public static get<T extends typeof Entity>(this: T, key: number | string,
    options?: GetOptions):
     Promise<InstanceType<T>>{
    const resource = `/${this.resourceName}/${String(key)}/`;
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
    return this.merchi.authenticatedFetch(resource, fetchOptions).
      then((data: any) => {
        const result: InstanceType<T> = (new this()) as InstanceType<T>;
        result.fromJson(data[this.singularName]);
        return result;
      });
  }

  public static list<T extends typeof Entity>(this: T, options?: ListOptions):
      Promise<ListResponse<InstanceType<T>>> {
    const resource = `/${this.resourceName}/`;
    const fetchOptions: RequestOptions = {};
    fetchOptions.query = [];
    if (options) {
      if (options.embed) {
        fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
      }
      if (options.offset !== undefined) {
        fetchOptions.query.push(['offset', options.offset.toString()]);
      }
      if (options.limit !== undefined) {
        fetchOptions.query.push(['limit', options.limit.toString()]);
      }
      if (options.q !== undefined) {
        fetchOptions.query.push(['q', options.q]);
      }
      if (options.sort !== undefined) {
        fetchOptions.query.push(['sort', options.sort]);
      }
      if (options.order !== undefined) {
        if (options.order === SortOrder.ASCENDING) {
          fetchOptions.query.push(['order', 'asc']);
        } else {
          fetchOptions.query.push(['order', 'desc']);
        }
      }
      if (options.tab !== undefined) {
        fetchOptions.query.push(['tab', options.tab]);
      }
      if (options.as !== undefined) {
        fetchOptions.query.push(['as', options.as]);
      }
      if (options.state !== undefined) {
        fetchOptions.query.push(['state', options.state]);
      }
      if (options.categoryId !== undefined) {
        fetchOptions.query.push(['category_id', options.categoryId.toString()]);
      }
      if (options.inDomain !== undefined) {
        fetchOptions.query.push(['in_domain', options.inDomain.toString()]);
      }
      if (options.inDomainRoles !== undefined) {
        fetchOptions.query.push(['in_domain_roles',
          options.inDomainRoles.join(',')]);
      } 
      if (options.asRole !== undefined) {
        fetchOptions.query.push(['as_role', options.asRole.toString()]);
      } 
      if (options.publicOnly !== undefined) {
        fetchOptions.query.push(['public_only', options.publicOnly.toString()]);
      } 
      if (options.managedOnly !== undefined) {
        fetchOptions.query.push(['managed_only',
          options.managedOnly.toString()]);
      } 
      if (options.memberOnly !== undefined) {
        fetchOptions.query.push(['member_only', options.memberOnly.toString()]);
      } 
      if (options.domainRoles !== undefined) {
        fetchOptions.query.push(['domain_roles',
          options.domainRoles.join(',')]);
      }
      if (options.managedDomainsOnly !== undefined) {
        fetchOptions.query.push(['managed_domains_only',
          options.managedDomainsOnly.toString()]);
      }
      if (options.businessDomainsOnly !== undefined) {
        fetchOptions.query.push(['business_domains_only',
          options.businessDomainsOnly.toString()]);
      }
      if (options.dateFrom !== undefined) {
        fetchOptions.query.push(['date_from',
          toUnixTimestamp(options.dateFrom)]);
      }
      if (options.dateTo !== undefined) {
        fetchOptions.query.push(['date_to', toUnixTimestamp(options.dateTo)]);
      }
      if (options.relatedJob !== undefined) {
        fetchOptions.query.push(['related_job', options.relatedJob.toString()]);
      }
      if (options.relatedProduct !== undefined) {
        fetchOptions.query.push(['related_product',
          options.relatedProduct.toString()]);
      }
      if (options.jobNotifiable !== undefined) {
        fetchOptions.query.push(['job_notifiable',
          options.jobNotifiable.toString()]);
      }
      if (options.notificationType !== undefined) {
        fetchOptions.query.push(['notification_type',
          options.notificationType.toString()]);
      }
      if (options.notificationRecipient !== undefined) {
        fetchOptions.query.push(['notification_recipient',
          options.notificationRecipient.toString()]);
      }
      if (options.notificationJob !== undefined) {
        fetchOptions.query.push(['notification_job',
          options.notificationJob.toString()]);
      }
      if (options.relatedUser !== undefined) {
        fetchOptions.query.push(['related_user',
          options.relatedUser.toString()]);
      }
      if (options.clientId !== undefined) {
        fetchOptions.query.push(['client_id', options.clientId.toString()]);
      }
      if (options.clientCompanyId !== undefined) {
        fetchOptions.query.push(['client_company_id',
          options.clientCompanyId.toString()]);
      }
      if (options.savedByUser !== undefined) {
        fetchOptions.query.push(['saved_by_user',
          options.savedByUser.toString()]);
      }
      if (options.receiverId !== undefined) {
        fetchOptions.query.push(['receiver_id', options.receiverId.toString()]);
      }
      if (options.companyId !== undefined) {
        fetchOptions.query.push(['company_id', options.companyId.toString()]);
      }
      if (options.componentId !== undefined) {
        fetchOptions.query.push(['component_id',
          options.componentId.toString()]);
      }
      if (options.section !== undefined) {
        fetchOptions.query.push(['section', options.section.toString()]);
      }
      if (options.senderRole !== undefined) {
        fetchOptions.query.push(['senderRole', options.senderRole.toString()]);
      }
      if (options.isOrder) {
        fetchOptions.query.push(['is_order', 'true']);
      }
      if (options.tags !== undefined) {
        fetchOptions.query.push(['tags', options.tags.join(',')]);
      }
      if (options.exclude !== undefined) {
        fetchOptions.query.push(['exclude', options.exclude.join(',')]);
      }
    }
    if (!(options && options.withRights)) {
      fetchOptions.query.push(['skip_rights', 'y']);
    }
    return this.merchi.authenticatedFetch(resource, fetchOptions).then((data: any) => {
      const metadata = {canCreate: data.canCreate,
        available: data.available,
        count: data.count,
        limit: data.limit,
        offset: data.offset};
      const pluralName = this.pluralName;
      const singularName = this.singularName;
      const items: Array<any> = data[pluralName];
      const entities = [];
      for (let item of items) {
        const entity: InstanceType<T> = (new this()) as InstanceType<T>;
        entity.fromJson(item[singularName]);
        entities.push(entity);
      }
      return {items: entities,
        metadata: metadata};
    });
  }

  public save = (options?: SaveOptions) => {
    const primaryKey: number | string = this.getPrimaryKeyValue();
    const constructor = this.constructor as typeof Entity;
    const resourceName:string = constructor.resourceName;
    const singularName: string = constructor.singularName;
    const resource = `/${resourceName}/${String(primaryKey)}/`;
    const data = this.toFormData();
    const fetchOptions: RequestOptions = {method: 'PATCH',
      body: data};
    fetchOptions.query = [];
    if (!(options && options.withRights)) {
      fetchOptions.query.push(['skip_rights', 'y']);
    }
    return this.merchi.authenticatedFetch(resource, fetchOptions).then((data: any) => {
      this.fromJson(data[singularName]);
      return this;
    });
  };

  public createFactory = (
    {resourceName = (this.constructor as typeof Entity).resourceName}
  ) => () => {
    const resource = `/${resourceName}/`;
    const data = this.toFormData();
    const singularName = (this.constructor as typeof Entity).singularName
    const fetchOptions: RequestOptions = {method: 'POST',
      body: data};
    return this.merchi.authenticatedFetch(resource, fetchOptions).
      then((data: any) => {
        this.fromJson(data[singularName]);
        return this;});
  }

  public create = this.createFactory({});

  private getEntityClass = (name: string) => {
    if (name === undefined) {
      return undefined;
    }
    return (this.merchi as any)[name];
  }

  protected checkSameSession = (other?: Entity) => {
    if (other !== undefined && other.merchi.sessionToken !== this.merchi.sessionToken) {
      throw new Error('cannot mix objects from different sessions');
    }
  };

  protected checkSameSessionList = (other?: Array<Entity>) =>  {
    if (other !== undefined) {
      other.map(this.checkSameSession);
    }
  };


  public fromJson = (json: any) => {
    for (const key in json) {
      const value: any = (json as any)[key];
      const propertyInfo = this.propertiesMap.get(key);
      if (propertyInfo !== undefined) {
        propertyInfo.dirty = false;
        if (propertyInfo.arrayType) {
          const array = [];
          for (const item of value) {
            const nested = new (propertyInfo.arrayType as any)(this.merchi);
            nested.fromJson(item);
            array.push(nested);
          }
          propertyInfo.currentValue = array;
        } else if (propertyInfo.type.prototype instanceof Entity) {
          const nested = new (propertyInfo.type as any)(this.merchi);
          nested.fromJson(value);
          propertyInfo.currentValue = nested;
        } else {
          propertyInfo.currentValue = value;
        }
      }
    }
    return this;
  }

  public toJson = () => {
    const json: any = {};
    for (const entry of this.propertiesMap.entries()) {
      const propertyName = entry[0];
      const propertyInfo = entry[1];
      if (propertyInfo.currentValue !== undefined) {
        if (propertyInfo.arrayType) {
          const array = propertyInfo.currentValue.map((v: any) => v.toJson());
          json[propertyName] = array;
        } else if (propertyInfo.type.prototype instanceof Entity) {
          json[propertyName] = propertyInfo.currentValue.toJson();
        } else {
          json[propertyName] = propertyInfo.currentValue;
        }
      }
    }
    return json;
  }

  protected forEachProperty = (fn: (i: PropertyInfo) => void) => {
    for (const info of this.propertiesMap.values()) {
      fn(info);
    }
  }

  public toFormData = (options?: SerialiseOptions): FormData => {
    options = options || {};
    const result = options.existing || new FormData();
    const prefix = options._prefix || '';
    let fileIndex = options._fileIndex || 0;
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
    if ((this as any).fileData !== undefined) {
      result.set(String(fileIndex), (this as any).fileData);
      appendData('fileDataIndex', fileIndex);
      fileIndex++;
    }
    const processArrayProperty = (info: PropertyInfo, value: Array<Entity>) => {
      const remoteCount = value.length;
      const initialLength = Array.from((result as any).entries()).length;
      if (remoteCount === 0 && info.dirty) {
        appendData(info.property + '-count', 0);
        return;
      }

      let isDirty = false;
      for (const item of value) {
        if (item.isDirty) {
          isDirty = true;
          break;
        }
      }
      isDirty = isDirty || info.dirty;
      if (!isDirty) {
        return;
      }
      for (let i = 0; i < remoteCount; ++i) {
        let innerPrefix = info.property + '-' + i;
        if (prefix) {
          innerPrefix = prefix + '-' + innerPrefix;
        }
        value[i].toFormData({existing: result, _prefix: innerPrefix,
          _fileIndex: fileIndex});
      }
      const finalLength = Array.from((result as any).entries()).length;
      if ((finalLength - initialLength) > 0) {
        appendData(info.property + '-count', remoteCount);
      }
    };
    const processSingleEntityProperty = (info: PropertyInfo, value: Entity) => {
      let innerPrefix = info.property + '-0';
      if (!(info.dirty || value.isDirty)) {
        return;
      }
      if (prefix) {
        innerPrefix = prefix + '-' + innerPrefix;
      }
      const initialLength = Array.from((result as any).entries()).length;
      value.toFormData({existing: result, _prefix: innerPrefix,
        _fileIndex: fileIndex});
      const finalLength = Array.from((result as any).entries()).length;
      if ((finalLength - initialLength) > 0) {
        appendData(info.property + '-count', 1);
      }
    };
    const processScalarProperty = (info: PropertyInfo, value: any) => {
      const primaryKey: string = (this.constructor as typeof Entity).primaryKey;
      if (info.dirty || (info.property === primaryKey && value)) {
        appendData(info.property, value);
      }
    };
    const processProperty = (info: PropertyInfo) => {
      const value = (this as any)[info.attribute];
      if (value === undefined) {
        return;
      } else if (info.arrayType) {
        processArrayProperty(info, value);
      } else if (info.type.prototype instanceof Entity) {
        processSingleEntityProperty(info, value);
      } else {
        processScalarProperty(info, value);
      }
    };
    this.forEachProperty(processProperty);
    return result;
  }

  protected addBackObject = (remote?: Entity) => {
    if (remote !== undefined) {
      remote.backObjects.add(this);
    }
  }

  protected addBackObjectList = (remotes?: Array<Entity>) => {
    if (remotes !== undefined) {
      remotes.forEach(this.addBackObject);
    }
  }

  protected markDirty = (property: string, newValue: any) => {
    if (newValue === undefined) {
      return;
    } 
    (this.propertiesMap.get(property) as PropertyInfo).dirty = true;
    const openSet: Array<Entity> = [];  /* Queue (BFS) */
    const closedSet = new Set();
    openSet.push(this);
    while (openSet.length > 0) {
      const current = openSet.shift() as Entity;
      if (!closedSet.has(current)) {
        current.isDirty = true;
        closedSet.add(current);
        for (const child of current.backObjects) openSet.push(child);
      }
    }
  }

  public delete = (options?: DeleteOptions) => {
    const primaryKey: number = this.getPrimaryKeyValue();
    const resourceName:string = (this.constructor as any).resourceName;
    const resource = `/${resourceName}/${String(primaryKey)}/`;
    const fetchOptions: RequestOptions = {method: 'DELETE'};
    fetchOptions.query = [];
    if (!(options && options.withRights)) {
      fetchOptions.query.push(['skip_rights', 'y']);
    }
    return this.merchi.authenticatedFetch(resource, fetchOptions).then(() => {
      return null;
    });
  };
}
