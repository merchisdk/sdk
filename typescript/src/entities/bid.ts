import { Assignment } from './assignment';
import { BidItem } from './bid_item';
import { Entity } from '../entity';
import { kahanSum } from '../util/float';

export class Bid extends Entity {
  protected static resourceName: string = "bids";
  protected static singularName: string = "bid";
  protected static pluralName: string = "bids";

  @Bid.property({type: Date})
  public archived?: Date | null;

  @Bid.property()
  public id?: number;

  @Bid.property({type: Date})
  public agreedDeadline?: Date | null;

  @Bid.property({arrayType: "BidItem"})
  public bidItems?: Array<BidItem>;

  @Bid.property({arrayType: "Assignment"})
  public assignments?: Array<Assignment>;

  public quoteTotal = () => {
    if (this.bidItems === undefined) {
      throw new Error("bidItems is undefined, did you forget to embed it?");
    }
    function getTotal(bidItem: BidItem) {
      return parseFloat(bidItem.total());
    }
    return kahanSum(this.bidItems.map(getTotal)).toFixed(3);
  }

  public findBidItemIndex = (bidItemId: number) => {
    if (this.bidItems === undefined) {
      throw new Error("bidItems is undefined, did you forget to embed it?");
    }
    function checkEqualId(bidItem: BidItem) {
      return bidItem.id === bidItemId;
    }
    return this.bidItems.findIndex(checkEqualId); 
  }

  public removeBidItem = (bidItem: BidItem) => {
    if (this.bidItems === undefined) {
      throw new Error("bidItems is undefined, did you forget to embed it?");
    }
    if (bidItem.id === undefined) {
      throw new Error("bidItem.id is undefined, did you forget to embed it?");
    }
    const index = this.findBidItemIndex(bidItem.id);
    if (index > -1) { 
      this.bidItems.splice(index, 1);
    }
  }

  public deadlineTimeDifference = () => {
    if (this.agreedDeadline === undefined) {
      const err = "agreedDeadline is undefined, did you forget to embed it?";
      throw new Error(err);
    }
    if (this.assignments === undefined) {
      const err = "assignments is undefiend, did you forget to embed it?";
      throw new Error(err);
    }
    if (this.assignments.length < 1) {
      return null;
    }
    if (this.agreedDeadline === null) {
      return null;
    }
    const assignment = this.assignments[0];
    if (assignment.productionDeadline === undefined) {
      const err = "productionDeadline is undefined, did you forget to embed" +
        "it?";
      throw new Error(err);
    }
    const productionDeadline = assignment.productionDeadline;
    return productionDeadline.valueOf() - this.agreedDeadline.valueOf();
  }
}
