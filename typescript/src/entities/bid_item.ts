import { Bid } from './bid';
import { Entity } from '../entity';

export class BidItem extends Entity {
  protected static resourceName: string = "bid_items";
  protected static singularName: string = "bidItem";
  protected static pluralName: string = "bitItems";

  @BidItem.property("archived")
  public archived?: Date | null;

  @BidItem.property("id")
  public id?: number;

  @BidItem.property("type")
  public type?: number;

  @BidItem.property("quantity")
  public quantity?: number;

  @BidItem.property("description")
  public description?: string | null;

  @BidItem.property("unitPrice")
  public unitPrice?: number | null;

  @BidItem.property("bid")
  public bid?: Bid;
}
