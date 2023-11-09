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
// eslint-disable-next-line no-unused-vars
import { DomainType } from './constants/domain_types';
// eslint-disable-next-line no-unused-vars
import { ProductType } from './constants/product_types';
import { generateUUID } from './uuid';

function toUnixTimestamp(date: Date) {
  return parseInt(String(date.getTime() / 1000)).toFixed(0);
}

interface Counter {
  value: number;
}

interface PropertyOptions {
  embeddedByDefault?: boolean;
  jsonName?: string;
  type?: any;
  arrayType?: string;
}

export interface EmbedDescriptor {
  [property: string]: {} | EmbedDescriptor;
}

export interface NestedIncludeArchivedDescriptor {
  [property: string]: {} | boolean | NestedIncludeArchivedDescriptor;
}

export type IncludeArchivedDescriptor = boolean | NestedIncludeArchivedDescriptor;

interface FromJsonOptions {
  arrayValueStrict?: boolean;
  makeDirty?: boolean;
}

interface CreateOptions {
  withRights?: boolean;
  embed?: EmbedDescriptor;
}

interface SaveOptions {
  withRights?: boolean;
  embed?: EmbedDescriptor;
}

interface DeleteOptions {
  withRights?: boolean;
}

interface GetOptions {
  embed?: EmbedDescriptor;
  includeArchived?: IncludeArchivedDescriptor;
  withRights?: boolean;
}

export enum SerialiseMethod {
  // eslint-disable-next-line no-unused-vars
  TO_DICT = 'to_dict',
  // eslint-disable-next-line no-unused-vars
  ONLY_ID = 'only_id',
}

interface ListOptions {
  as?: string;
  asRole?: Role;
  businessDomainsOnly?: boolean;
  categoryId?: number;
  clientId?: number;
  clientCompanyId?: number;
  clientOnly?: boolean;
  companyCustomerId?: number;
  companyId?: number;
  companySupplierId?: number;
  componentId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  domainRoles?: Role[];
  domainTypes?: DomainType[];
  doesNotHaveAdminDomain?: boolean;
  embed?: EmbedDescriptor;
  entityTypes?: number[];
  exclude?: number[];
  excludeComponents?: string[];
  excludeDomains?: number[];
  groupBuyForJobId?: number;
  groupBuyOnly?: boolean;
  inbound?: boolean;
  includeOnly?: number[];
  inDomain?: number;
  inDomainName?: string;
  inDomainRoles?: number[];
  isMaster?: boolean;
  isOrder?: boolean;
  isPrivate?: boolean;
  jobNotifiable?: number;
  limit?: number;
  managedDomainsOnly?: boolean;
  managedOnly?: boolean;
  managerId?: number;
  masterProduct?: number;
  memberOnly?: boolean;
  merchiOnly?: boolean;
  notificationJob?: number;
  notificationRecipient?: number;
  notificationType?: NotificationType;
  offset?: number;
  orClientId?: number;
  orClientCompanyId?: number;
  order?: string;
  originalOf?: number;
  platformCategoryId?: number;
  productTypes?: ProductType[];
  publicOnly?: boolean;
  q?: string;
  receiverId?: number;
  relatedAssignment?: number;
  relatedComponent?: number;
  relatedDraft?: number;
  relatedJob?: number;
  relatedProduct?: number;
  relatedUser?: number;
  savedByUser?: number;
  section?: NotificationSection;
  senderRole?: Role;
  serialiseMethod?: SerialiseMethod;
  shopifyOnly?: boolean;
  sort?: string;
  state?: string;
  supplierResellOnly?: boolean;
  tab?: string;
  tags?: number[];
  tagsInternal?: number[];
  tagNames?: string[];
  teamOnly?: boolean;
  withRights?: boolean;
}

export interface ListMetadata {
  canCreate?: boolean;
  available: number;
  count: number;
  limit: number;
  offset: number;
}

export interface ListResponse<T> {
  items: T[];
  metadata: ListMetadata;
}

interface SerialiseOptions {
  existing?: FormData;
  excludeOld?: boolean;
  _prefix?: string;
}

interface PropertyInfo {
  property: string;  // this is the json name, e.g. 'id'
  attribute: string;  // this is the js attribute name, e.g. '_id'
  type: Function;  // e.g. Number
  arrayType?: Entity;  // if type is an array, arrayType is the element type
  dirty: boolean;  // true if out of date with server
  currentValue?: any;  // type is actually `this.type | undefined`
  updatingOrder: boolean;
  embeddedByDefault: boolean;
}

export class Entity {
  private static jsonNameKey = Symbol('jsonName');
  private static arrayTypeKey = Symbol('arrayType');
  private static extraOptionsKey = Symbol('extraOptions');
  private static propertiesSetKey = Symbol('propertiesSet');

  protected static resourceName: string;
  protected static singularName: string;
  protected static pluralName: string;
  protected static primaryKey = 'id';

  // these will be set by the parent Merchi object
  public merchi!: Merchi;
  public static merchi: Merchi;

  public isDirty = false;
  // maps json names like 'id' to information about that property
  public propertiesMap: Map<string, PropertyInfo>;
  public readonly backObjects: Set<Entity> = new Set();

  public key = generateUUID();

  protected isSingleEntityProperty(info: PropertyInfo) {
    // the choice of 'Product' below is unimportant -- all Entities should
    // have the same prototype but i don't know how to get instanceof
    // working, so i just compare prototypes directly.
    return (
      info.type.prototype === this.merchi.Product.prototype ||
      info.type.prototype instanceof Entity
    );
  }

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
      let type;
      if (options.type === undefined) {
        type = propertyType;
      } else {
        type = options.type;
        if (typeof type === 'string') {
          type = self.getEntityClass(type);
        }
        if (type.prototype instanceof Entity) {
          type = self.merchi.setupClass(type);
        }
      }
      const normallyEmbeddedByDefault = !(realArrayType ||
        type.prototype instanceof Entity);
      const embeddedByDefault = options.embeddedByDefault !== undefined ?
        options.embeddedByDefault : normallyEmbeddedByDefault;
      /* istanbul ignore next */
      if (type === Object) {
        /* istanbul ignore next */
        const resource = (self.constructor as typeof Entity).resourceName;
        const err = 'Bad attribute type ' +
          `${resource}.${attributeName}: ${type}`;
        throw new Error(err);
      }
      const propertyInfo: PropertyInfo = {property: jsonName,
        attribute: attributeName,
        type: type,
        arrayType: realArrayType,
        embeddedByDefault: embeddedByDefault,
        dirty: true,
        updatingOrder: false};
      map.set(jsonName, propertyInfo);
    });
    return map;
  }

  public constructor(merchi?: Merchi) {
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
  };

  private setupProperties = () => {
    const properties: any = {};
    const makeSetSingle = (info: PropertyInfo) => {
      const get = () => {
        return info.currentValue;
      };
      const set = (newValue?: Entity) => {
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
      const set = (newValue?: Entity[]) => {
        info.currentValue = newValue;
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
  };

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
      fetchOptions.query.push(['include_archived',
        JSON.stringify(options.includeArchived)]);
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
        fetchOptions.query.push(['order', options.order]);
      }
      if (options.serialiseMethod !== undefined) {
        fetchOptions.query.push(['serialise_method', options.serialiseMethod]);
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
      if (options.platformCategoryId !== undefined) {
        fetchOptions.query.push(['platform_category_id', options.platformCategoryId.toString()]);
      }
      if (options.inDomain !== undefined) {
        fetchOptions.query.push(['in_domain', options.inDomain.toString()]);
      }
      if (options.inDomainName !== undefined) {
        fetchOptions.query.push(['in_domain_name', options.inDomainName.toString()]);
      }
      if (options.inDomainRoles !== undefined) {
        fetchOptions.query.push(['in_domain_roles',
          JSON.stringify(options.inDomainRoles)]);
      }
      if (options.isPrivate !== undefined) {
        fetchOptions.query.push(['is_private', options.isPrivate.toString()]);
      }
      if (options.asRole !== undefined) {
        fetchOptions.query.push(['as_role', options.asRole.toString()]);
      }
      if (options.groupBuyOnly !== undefined) {
        fetchOptions.query.push(
          ['group_buy_only', options.groupBuyOnly.toString()]);
      }
      if (options.publicOnly !== undefined) {
        fetchOptions.query.push(['public_only', options.publicOnly.toString()]);
      }
      if (options.managedOnly !== undefined) {
        fetchOptions.query.push(['managed_only',
          options.managedOnly.toString()]);
      }
      if (options.doesNotHaveAdminDomain !== undefined) {
        fetchOptions.query.push(['does_not_have_admin_domain',
          options.doesNotHaveAdminDomain.toString()]);
      }
      if (options.clientOnly !== undefined) {
        fetchOptions.query.push(['client_only',
          options.clientOnly.toString()]);
      }
      if (options.teamOnly !== undefined) {
        fetchOptions.query.push(['team_only',
          options.teamOnly.toString()]);
      }
      if (options.memberOnly !== undefined) {
        fetchOptions.query.push(['member_only', options.memberOnly.toString()]);
      }
      if (options.merchiOnly !== undefined) {
        fetchOptions.query.push(['merchi_only', options.merchiOnly.toString()]);
      }
      if (options.supplierResellOnly !== undefined) {
        fetchOptions.query.push(
          ['supplier_resell_only', options.supplierResellOnly.toString()]
        );
      }
      if (options.shopifyOnly !== undefined) {
        fetchOptions.query.push(['shopify_only', options.shopifyOnly.toString()]);
      }
      if (options.inbound !== undefined) {
        fetchOptions.query.push(['inbound', options.inbound.toString()]);
      }
      if (options.isMaster !== undefined) {
        fetchOptions.query.push(['is_master', options.isMaster.toString()]);
      }
      if (options.domainRoles !== undefined) {
        fetchOptions.query.push(['domain_roles',
          options.domainRoles.join(',')]);
      }
      if (options.domainTypes !== undefined) {
        fetchOptions.query.push(['domain_types',
          options.domainTypes.join(',')]);
      }
      if (options.entityTypes !== undefined) {
        fetchOptions.query.push(['entity_types',
          options.entityTypes.join(',')]);
      }
      if (options.productTypes !== undefined) {
        fetchOptions.query.push(['product_types',
          options.productTypes.join(',')]);
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
      if (options.originalOf !== undefined) {
        fetchOptions.query.push(['original_of',
          options.originalOf.toString()]);
      }
      if (options.relatedComponent !== undefined) {
        fetchOptions.query.push(['related_component',
          options.relatedComponent.toString()]);
      }
      if (options.relatedAssignment !== undefined) {
        fetchOptions.query.push(['related_assignment',
          options.relatedAssignment.toString()]);
      }
      if (options.relatedDraft !== undefined) {
        fetchOptions.query.push(['related_draft',
          options.relatedDraft.toString()]);
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
      if (options.managerId !== undefined) {
        fetchOptions.query.push(['manager_id', options.managerId.toString()]);
      }
      if (options.masterProduct !== undefined) {
        fetchOptions.query.push(['master_product', options.masterProduct.toString()]);
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
      if (options.companyCustomerId !== undefined) {
        fetchOptions.query.push(['company_customer_id', options.companyCustomerId.toString()]);
      }
      if (options.companyId !== undefined) {
        fetchOptions.query.push(['company_id', options.companyId.toString()]);
      }
      if (options.companySupplierId !== undefined) {
        fetchOptions.query.push(['company_supplier_id', options.companySupplierId.toString()]);
      }
      if (options.componentId !== undefined) {
        fetchOptions.query.push(['component_id',
          options.componentId.toString()]);
      }
      if (options.groupBuyForJobId !== undefined) {
        fetchOptions.query.push(['group_buy_for_job_id',
          options.groupBuyForJobId.toString()]);
      }
      if (options.section !== undefined) {
        fetchOptions.query.push(['section', options.section.toString()]);
      }
      if (options.senderRole !== undefined) {
        fetchOptions.query.push(['sender_role', options.senderRole.toString()]);
      }
      if (options.isOrder) {
        fetchOptions.query.push(['is_order', 'true']);
      }
      if (options.tags !== undefined) {
        fetchOptions.query.push(['tags', options.tags.join(',')]);
      }
      if (options.tagsInternal !== undefined) {
        fetchOptions.query.push(['tags_internal', options.tagsInternal.join(',')]);
      }
      if (options.tagNames !== undefined) {
        fetchOptions.query.push(['tag_names', options.tagNames.join(',')]);
      }
      if (options.exclude !== undefined) {
        fetchOptions.query.push(['exclude', options.exclude.join(',')]);
      }
      if (options.excludeComponents !== undefined) {
        fetchOptions.query.push(
          ['exclude_components', options.excludeComponents.join(',')]);
      }
      if (options.excludeDomains !== undefined) {
        fetchOptions.query.push(
          ['exclude_domains', options.excludeDomains.join(',')]);
      }
      if (options.includeOnly !== undefined) {
        fetchOptions.query.push(['include_only', options.includeOnly.join(',')]);
      }
      if (options.orClientId !== undefined) {
        fetchOptions.query.push(['or_client_id', options.orClientId.toString()]);
      }
      if (options.orClientCompanyId !== undefined) {
        fetchOptions.query.push(
          ['or_client_company_id', options.orClientCompanyId.toString()]);
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
      const items: any[] = data[pluralName];
      const entities = [];
      for (const item of items) {
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
    const resourceName: string = constructor.resourceName;
    const singularName: string = constructor.singularName;
    const resource = `/${resourceName}/${String(primaryKey)}/`;
    const data = this.toFormData();
    const fetchOptions: RequestOptions = {method: 'PATCH',
      body: data};
    fetchOptions.query = [];
    if (options && options.embed) {
      fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
    }
    if (!(options && options.withRights)) {
      fetchOptions.query.push(['skip_rights', 'y']);
    }
    return this.merchi.authenticatedFetch(resource, fetchOptions).then((data: any) => {
      this.fromJson(data[singularName]);
      this.cleanDirty();
      return this;
    });
  };

  public createFactory = (
    {resourceName = (this.constructor as typeof Entity).resourceName}
  ) => (options?: CreateOptions) => {
    const resource = `/${resourceName}/`;
    const data = this.toFormData();
    const singularName = (this.constructor as typeof Entity).singularName;
    const fetchOptions: RequestOptions = {method: 'POST',
      body: data};

    fetchOptions.query = [];
    if (options && options.embed) {
      fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
    }
    if (!(options && options.withRights)) {
      fetchOptions.query.push(['skip_rights', 'y']);
    }
    return this.merchi.authenticatedFetch(resource, fetchOptions).
      then((data: any) => {
        this.fromJson(data[singularName]);
        this.cleanDirty();
        return this;});
  };

  public create = this.createFactory({});

  private getEntityClass = (name: string) => {
    if (name === undefined) {
      return undefined;
    }
    return (this.merchi as any)[name];
  };

  public cleanDirty = () => {
    // remove all dirty records of this entity, makes it untouched
    // entity
    this.isDirty = false;
    for (const entry of this.propertiesMap.entries()) {
      const propertyInfo = entry[1];
      propertyInfo.dirty = false;
      if (propertyInfo.currentValue !== undefined) {
        if (propertyInfo.arrayType) {
          propertyInfo.currentValue.map((v: any) => v.cleanDirty());
        } else if (this.isSingleEntityProperty(propertyInfo)) {
          if (propertyInfo.currentValue) {
            propertyInfo.currentValue.cleanDirty();
          }
        }
      }
    }
  };


  public fromJson = (json: any, options?: FromJsonOptions) => {
    options = options || {};
    const { makeDirty = false, arrayValueStrict = true } = options;
    options = { makeDirty, arrayValueStrict };
    for (const key in json) {
      const value: any = (json as any)[key];
      if (value === undefined) continue;
      const propertyInfo = this.propertiesMap.get(key);
      if (propertyInfo !== undefined) {
        propertyInfo.dirty = makeDirty;
        if (propertyInfo.arrayType) {
          // ignore array value if it is not an array and we did expect it
          if (!arrayValueStrict && !Array.isArray(value)) continue;
          const newValue: any = value.map((item: any, index: number) => {
            const currentValue: any = propertyInfo.currentValue;
            // if property already have an array of entities as relationship,
            // try to merge with json one by one, this behavior may need to be
            // configurable in the future.
            if (currentValue && currentValue[index]) {
              return currentValue[index].fromJson(item, options);
            }
            const nested = new (propertyInfo.arrayType as any)(this.merchi);
            return nested.fromJson(item, options);
          });
          propertyInfo.currentValue = newValue;
        } else if (this.isSingleEntityProperty(propertyInfo)) {
          // if property already have a entity as relationship, try to merge
          // with json first, this behavior may need to be configurable in the
          // future.
          if (propertyInfo.currentValue) {
            propertyInfo.currentValue.fromJson(value, options);
          } else {
            const nested = new (propertyInfo.type as any)(this.merchi);
            propertyInfo.currentValue = nested.fromJson(value, options);
          }
        } else {
          propertyInfo.currentValue = value;
          if (propertyInfo.type === Date && !!value) {
            propertyInfo.currentValue = new Date(value * 1000);
          }
        }
      }
    }
    return this;
  };

  public toJson = () => {
    const json: any = {};
    for (const entry of this.propertiesMap.entries()) {
      const propertyName = entry[0];
      const propertyInfo = entry[1];
      if (propertyInfo.currentValue !== undefined) {
        if (propertyInfo.arrayType) {
          const array = propertyInfo.currentValue.map((v: any) => v.toJson());
          json[propertyName] = array;
        } else if (this.isSingleEntityProperty(propertyInfo)) {
          if (propertyInfo.currentValue === null) {
            json[propertyName] = null;
          } else {
            json[propertyName] = propertyInfo.currentValue.toJson();
          }
        } else {
          const value = propertyInfo.currentValue;
          json[propertyName] = value;
          if (propertyInfo.type === Date && !!value) {
            json[propertyName] = value.getTime() / 1000;
          }
        }
      }
    }
    return json;
  };

  protected forEachProperty = (fn: (i: PropertyInfo) => void) => {
    for (const info of this.propertiesMap.values()) {
      fn(info);
    }
  };

  public toFormData = (options?: SerialiseOptions,
    fileIndex?: Counter): FormData => {
    if (options === undefined) {
      options = {};
    }
    const result = options.existing || new FormData();
    const prefix = options._prefix || '';
    const excludeOld = options.excludeOld === undefined ?
      true : options.excludeOld;
    if (fileIndex === undefined) {
      fileIndex = {value: 0};
    }
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
      result.set(String(fileIndex.value), (this as any).fileData);
      appendData('fileDataIndex', fileIndex.value);
      fileIndex.value++;
    }
    const processArrayProperty = (info: PropertyInfo, value: Entity[]) => {
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
      if (!isDirty && excludeOld) {
        return;
      }
      for (let i = 0; i < remoteCount; ++i) {
        let innerPrefix = info.property + '-' + i;
        if (prefix) {
          innerPrefix = prefix + '-' + innerPrefix;
        }
        value[i].toFormData(
          {existing: result, _prefix: innerPrefix, excludeOld: excludeOld},
          fileIndex);
      }
      const finalLength = Array.from((result as any).entries()).length;
      if ((finalLength - initialLength) > 0) {
        appendData(info.property + '-count', remoteCount);
        if (info.updatingOrder) {
          appendData(info.property + '-*updateOrder', 'true');
        }
      }
    };
    const processSingleEntityProperty = (info: PropertyInfo, value: Entity) => {
      const primaryKey: string = (this.constructor as typeof Entity).primaryKey;
      let innerPrefix = info.property + '-0';
      if (prefix) {
        innerPrefix = prefix + '-' + innerPrefix;
      }
      if (value === null) {
        if (info.dirty || !excludeOld) {
          appendData(info.property + '-0-' + primaryKey, '-1');
          appendData(info.property + '-count', 1);
        }
        return;
      }
      if (!(info.dirty || (value.isDirty)) && excludeOld) {
        return;
      }
      const initialLength = Array.from((result as any).entries()).length;
      value.toFormData(
        {existing: result, _prefix: innerPrefix, excludeOld: excludeOld},
        fileIndex);
      const finalLength = Array.from((result as any).entries()).length;
      if ((finalLength - initialLength) > 0) {
        appendData(info.property + '-count', 1);
      }
    };
    const processScalarProperty = (info: PropertyInfo, value: any) => {
      const primaryKey: string = (this.constructor as typeof Entity).primaryKey;
      if (!excludeOld ||
        info.dirty ||
        (info.property === primaryKey && value)) {
        if (info.type === Date && !!value) {
          value = value.getTime() / 1000;
        }
        appendData(info.property, value);
      }
    };
    const processProperty = (info: PropertyInfo) => {
      const value = (this as any)[info.attribute];
      if (value === undefined) {
        return;
      } else if (info.arrayType) {
        processArrayProperty(info, value);
      } else if (this.isSingleEntityProperty(info)) {
        processSingleEntityProperty(info, value);
      } else {
        processScalarProperty(info, value);
      }
    };
    this.forEachProperty(processProperty);
    return result;
  };

  protected addBackObject = (remote?: Entity) => {
    if (remote !== undefined) {
      remote.backObjects.add(this);
    }
  };

  protected addBackObjectList = (remotes?: Entity[]) => {
    if (remotes !== undefined) {
      remotes.forEach(this.addBackObject);
    }
  };

  public updateOrder = (property: string) => {
    (this.propertiesMap.get(property) as PropertyInfo).updatingOrder = true;
  };

  protected markDirty = (property: string, newValue: any) => {
    if (newValue === undefined) {
      return;
    }
    (this.propertiesMap.get(property) as PropertyInfo).dirty = true;
    const openSet: Entity[] = [];  /* Queue (BFS) */
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
  };

  public delete = (options?: DeleteOptions) => {
    const primaryKey: number = this.getPrimaryKeyValue();
    const resourceName: string = (this.constructor as any).resourceName;
    const resource = `/${resourceName}/${String(primaryKey)}/`;
    const fetchOptions: RequestOptions = {method: 'DELETE'};
    fetchOptions.query = [];
    if (!(options && options.withRights)) {
      fetchOptions.query.push(['skip_rights', 'y']);
    }
    if (this.merchi.sessionToken) {
      fetchOptions.query.push(['session_token', this.merchi.sessionToken]);
    }
    return this.merchi.authenticatedFetch(resource, fetchOptions, true).then(
      () => {return this;});
  };

  public recover = (options?: SaveOptions) => {
    const primaryKey: number | string = this.getPrimaryKeyValue();
    const constructor = this.constructor as typeof Entity;
    const resourceName: string = constructor.resourceName;
    const singularName: string = constructor.singularName;
    const resource = `/unarchive/${resourceName}/${String(primaryKey)}/`;
    const fetchOptions: RequestOptions = {method: 'POST'};
    fetchOptions.query = [];
    if (options && options.embed) {
      fetchOptions.query.push(['embed', JSON.stringify(options.embed)]);
    }
    if (!(options && options.withRights)) {
      fetchOptions.query.push(['skip_rights', 'y']);
    }
    return this.merchi.authenticatedFetch(resource, fetchOptions).then((data: any) => {
      this.fromJson(data[singularName]);
      return this;
    });
  };
}
