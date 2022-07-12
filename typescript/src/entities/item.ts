import { CountryTax } from './country_tax';
import { Entity } from '../entity';
import { Invoice } from './invoice';

export class Item extends Entity {
  protected static resourceName = 'items';
  protected static singularName = 'item';
  protected static pluralName = 'items';

  @Item.property({type: Date})
  public archived?: Date | null;

  @Item.property()
  public id?: number;

  @Item.property({type: Number})
  public quantity?: number | null;

  @Item.property()
  public description?: string;

  @Item.property()
  public cost?: number;

  @Item.property({type: Number})
  public taxAmount?: number | null;

  @Item.property({type: CountryTax})
  public taxType?: CountryTax | null;

  @Item.property({type: Invoice})
  public invoice?: Invoice | null;

  public totalCost = () => {
    if (this.quantity === undefined) {
      throw 'quantity is undefined, did you forget to embed it?';
    }
    if (this.cost === undefined) {
      throw 'cost is undefined, did you forget to embed it?';
    }
    const quantity = this.quantity === null ? 0 : this.quantity;
    return quantity * this.cost;
  };
}
