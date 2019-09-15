import { Assignment } from './assignment';
import { BidItem } from './bid_item';
import { Entity } from '../entity';

export class Bid extends Entity {
  protected static resourceName: string = "bids";
  protected static singularName: string = "bid";
  protected static pluralName: string = "bids";

  @Bid.property()
  public archived?: Date | null;

  @Bid.property()
  public id?: number;

  @Bid.property()
  public agreedDeadline?: Date | null;

  @Bid.property("BidItem")
  public bidItems?: Array<BidItem>;

  @Bid.property("Assignment")
  public assignments?: Array<Assignment>;
}
