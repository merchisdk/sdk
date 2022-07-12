import { Assignment } from './assignment';
import { QuoteItem } from './quote_item';
import { Shipment } from './shipment';
import { Invoice } from './invoice';
import { Entity } from '../entity';
import { kahanSum } from '../util/float';

interface CalculateOptions {
  strictEmbed?: boolean;
}

export class Quote extends Entity {
  protected static resourceName = 'quotes';
  protected static singularName = 'quote';
  protected static pluralName = 'quotes';

  @Quote.property({type: Date})
  public archived?: Date | null;

  @Quote.property()
  public currency?: string;

  @Quote.property()
  public id?: number;

  @Quote.property({type: Date})
  public agreedDeadline?: Date | null;

  @Quote.property({arrayType: 'Shipment'})
  public shipments?: Shipment[];

  @Quote.property({arrayType: 'QuoteItem'})
  public quoteItems?: QuoteItem[];

  @Quote.property({arrayType: 'Assignment'})
  public assignments?: Assignment[];

  @Quote.property({type: Invoice})
  public invoice?: Invoice | null;

  public quoteTotal = (options?: CalculateOptions) => {
    const { strictEmbed = true } = options ? options : {};
    const { quoteItems = [], shipments = [] } = this;
    if (strictEmbed && this.quoteItems === undefined) {
      throw new Error('quoteItems is undefined, did you forget to embed it?');
    }
    if (strictEmbed && this.shipments === undefined) {
      throw new Error('shipments is undefined, did you forget to embed it?');
    }
    const quoteItemsTotal = kahanSum(quoteItems.map((qI: QuoteItem) =>
      parseFloat(qI.calculateTotal(options)))).toFixed(3);
    const shipmentItemsTotal = kahanSum(shipments.map((s: Shipment) =>
      parseFloat(s.calculateTotal(options)))).toFixed(3);
    return (
      parseFloat(quoteItemsTotal) + parseFloat(shipmentItemsTotal)
    ).toFixed(3);
  };

  public calculateTotal = this.quoteTotal;

  public calculateSubTotal = (options?: CalculateOptions) => {
    const { strictEmbed = true } = options ? options : {};
    const { quoteItems = [], shipments = [] } = this;
    if (strictEmbed && this.quoteItems === undefined) {
      throw new Error('quoteItems is undefined, did you forget to embed it?');
    }
    if (strictEmbed && this.shipments === undefined) {
      throw new Error('shipments is undefined, did you forget to embed it?');
    }
    const quoteItemsTotal = kahanSum(quoteItems.map((qI: QuoteItem) =>
      parseFloat(qI.calculateSubTotal(options))));
    const shipmentItemsTotal = kahanSum(shipments.map((s: Shipment) =>
      parseFloat(s.calculateSubTotal(options))));
    return (quoteItemsTotal + shipmentItemsTotal).toFixed(3);
  };

  public calculateTaxAmount = (options?: CalculateOptions) => {
    const { strictEmbed = true } = options ? options : {};
    const { quoteItems = [], shipments = [] } = this;
    if (strictEmbed && this.quoteItems === undefined) {
      throw new Error('quoteItems is undefined, did you forget to embed it?');
    }
    if (strictEmbed && this.shipments === undefined) {
      throw new Error('shipments is undefined, did you forget to embed it?');
    }
    const quoteItemsTotal = kahanSum(quoteItems.map((qI: QuoteItem) =>
      parseFloat(qI.calculateTaxAmount(options))));
    const shipmentItemsTotal = kahanSum(shipments.map((s: Shipment) =>
      parseFloat(s.calculateTaxAmount(options))));
    return (quoteItemsTotal + shipmentItemsTotal).toFixed(3);
  };

  public findQuoteItemIndex = (quoteItemId: number) => {
    if (this.quoteItems === undefined) {
      throw new Error('quoteItems is undefined, did you forget to embed it?');
    }
    function checkEqualId(quoteItem: QuoteItem) {
      return quoteItem.id === quoteItemId;
    }
    return this.quoteItems.findIndex(checkEqualId);
  };

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
  };

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
  };
}
