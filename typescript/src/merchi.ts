import { Entity } from './entity';
import { Category } from './entities/category';
import { Domain } from './entities/domain';
import { Product } from './entities/product';
import { generateUUID } from './uuid';
// eslint-disable-next-line no-unused-vars
import { RequestOptions, apiFetch } from './request';
import { getCookie } from './cookie';


// the type of classes
export interface Type<T, A extends any[]> extends
   Function { new(...args: A): T; }

function cloneClass<T, A extends []>(original: Type<T, A>): Type<T, A> {
  // copy the constructor, but use the empty object as `this`
  const copy = original.bind({});
  // pick up any static members (this is shallow, the members are not copied)
  Object.assign(copy, original);
  return copy;
}

export class Merchi {
  public id: string = generateUUID();

  public Category: typeof Category
  public Domain: typeof Domain;
  public Product: typeof Product;

  public sessionToken?: string;

  constructor(sessionToken?: string) {
    if (sessionToken) {
      this.sessionToken = sessionToken;
    } else {
      this.sessionToken = getCookie('session_token');
    }
    function setupClass(merchi: Merchi, cls: typeof Entity) {
      // copy, to prevent interference from other merchi sessions
      const result = cloneClass(cls) as typeof Entity;
      result.prototype.merchi = merchi;
      return result;
    }
    // re-export configured versions of all classes
    this.Category = setupClass(this, Category) as typeof Category;
    this.Domain = setupClass(this, Domain) as typeof Domain;
    this.Product = setupClass(this, Product) as typeof Product;
  }

  public authenticatedFetch = (resource: string, options: RequestOptions) => {
    if (this.sessionToken) {
      /* istanbul ignore next */
      if (!options.query) {
        /* istanbul ignore next */
        options.query = [];
      }
      options.query.push(['session_token', this.sessionToken]);
    }
    return apiFetch(resource, options);
  }
}
