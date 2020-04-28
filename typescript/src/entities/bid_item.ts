import { Bid } from './bid';
import { Entity } from '../entity';

export class BidItem extends Entity {
  protected static resourceName: string = 'bid_items';
  protected static singularName: string = 'bidItem';
  protected static pluralName: string = 'bidItems';

  @BidItem.property({type: Date})
  public archived?: Date | null;

  @BidItem.property()
  public id?: number;

  @BidItem.property()
  public type?: number;

  @BidItem.property()
  public quantity?: number;

  @BidItem.property({type: String})
  public description?: string | null;

  @BidItem.property({type: Number})
  public unitPrice?: number | null;

  @BidItem.property()
  public bid?: Bid;

  public total = () => {
    const quant = this.quantity ? this.quantity : 0;
    const unitPrice = this.unitPrice ? this.unitPrice : 0;
    return (quant * unitPrice).toFixed(3);
  }
}
