import { Bid } from './bid';
import { Entity } from '../entity';

export class BidItem extends Entity {
  protected static resourceName: string = "bid_items";
  protected static singularName: string = "bidItem";
  protected static pluralName: string = "bidItems";

  @BidItem.property()
  public archived?: Date | null;

  @BidItem.property()
  public id?: number;

  @BidItem.property()
  public type?: number;

  @BidItem.property()
  public quantity?: number;

  @BidItem.property()
  public description?: string | null;

  @BidItem.property()
  public unitPrice?: number | null;

  @BidItem.property()
  public bid?: Bid;

  public total = () => {
    if (this.quantity === undefined) {
      throw new Error("quantity is undefined, did you forget to embed it?");
    }
    if (this.unitPrice === undefined) {
      throw new Error("unitPrice is undefined, did you forget to embed it?");
    }
    const unitPrice = this.unitPrice === null ? 0 : this.unitPrice;
    return (this.quantity * unitPrice).toFixed(3);
  }
}
