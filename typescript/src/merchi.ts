import { Entity } from './entity';
import { Category } from './entities/category';
import { Product } from './entities/product';
import { generateUUID } from './uuid';


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
  public Product: typeof Product;

  constructor() {
    function setupClass(merchi: Merchi, cls: typeof Entity) {
      // copy, to prevent interference from other merchi sessions
      const result = cloneClass(cls) as typeof Entity;
      result.prototype.merchi = merchi;
      return result;
    }
    // re-export configured versions of all classes
    this.Category = setupClass(this, Category) as typeof Category;
    this.Product = setupClass(this, Product) as typeof Product;
  }
}
