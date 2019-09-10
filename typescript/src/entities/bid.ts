import { Assignment } from './assignment';
import { BidItem } from './bid_item';
import { Entity } from '../entity';

export class Bid extends Entity {
  protected static resourceName: string = "bids";
  protected static singularName: string = "bid";
  protected static pluralName: string = "bids";

  @Bid.property("archived")
  public archived?: Date | null;

  @Bid.property("id")
  public id?: number;

  @Bid.property("agreedDeadline")
  public agreedDeadline?: Date | null;

  @Bid.property("bidItems", "BidItem")
  public bidItems?: Array<BidItem>;

  @Bid.property("assignments", "Assignment")
  public assignments?: Array<Assignment>;
}
