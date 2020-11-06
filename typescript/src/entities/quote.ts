import { Assignment } from './assignment';
import { QuoteItem } from './quote_item';
import { Entity } from '../entity';
import { kahanSum } from '../util/float';

export class Quote extends Entity {
  protected static resourceName: string = 'quotes';
  protected static singularName: string = 'quote';
  protected static pluralName: string = 'quotes';

  @Quote.property({type: Date})
  public archived?: Date | null;

  @Quote.property()
  public id?: number;

  @Quote.property({type: Date})
  public agreedDeadline?: Date | null;

  @Quote.property({arrayType: 'QuoteItem'})
  public quoteItems?: QuoteItem[];

  @Quote.property({arrayType: 'Assignment'})
  public assignments?: Assignment[];

  public quoteTotal = () => {
    if (this.quoteItems === undefined) {
      throw new Error('quoteItems is undefined, did you forget to embed it?');
    }
    function getTotal(quoteItem: QuoteItem) {
      return parseFloat(quoteItem.total());
    }
    return kahanSum(this.quoteItems.map(getTotal)).toFixed(3);
  }

  public findQuoteItemIndex = (quoteItemId: number) => {
    if (this.quoteItems === undefined) {
      throw new Error('quoteItems is undefined, did you forget to embed it?');
    }
    function checkEqualId(quoteItem: QuoteItem) {
      return quoteItem.id === quoteItemId;
    }
    return this.quoteItems.findIndex(checkEqualId); 
  }

  public removeQuoteItem = (quoteItem: QuoteItem) => {
    if (this.quoteItems === undefined) {
      throw new Error('quoteItems is undefined, did you forget to embed it?');
    }
    if (quoteItem.id === undefined) {
      throw new Error('quoteItem.id is undefined, did you forget to embed it?');
    }
    const index = this.findQuoteItemIndex(quoteItem.id);
    if (index > -1) { 
      this.quoteItems.splice(index, 1);
    }
  }

  public deadlineTimeDifference = () => {
    if (this.agreedDeadline === undefined) {
      const err = 'agreedDeadline is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    if (this.assignments === undefined) {
      const err = 'assignments is undefiend, did you forget to embed it?';
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
      const err = 'productionDeadline is undefined, did you forget to embed' +
        'it?';
      throw new Error(err);
    }
    const productionDeadline = assignment.productionDeadline;
    return productionDeadline.valueOf() - this.agreedDeadline.valueOf();
  }
}
