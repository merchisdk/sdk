import { CountryTax } from './country_tax';
import { Entity } from '../entity';
import { Quote } from './quote';

interface CalculateOptions {
  strictEmbed?: boolean;
}

export class QuoteItem extends Entity {
  protected static resourceName = 'quote_items';
  protected static singularName = 'quoteItem';
  protected static pluralName = 'quoteItems';

  @QuoteItem.property({type: Date})
  public archived?: Date | null;

  @QuoteItem.property()
  public id?: number;

  @QuoteItem.property()
  public type?: number;

  @QuoteItem.property()
  public quantity?: number;

  @QuoteItem.property({type: String})
  public description?: string | null;

  @QuoteItem.property({type: Number})
  public unitPrice?: number | null;

  @QuoteItem.property({type: Number})
  public taxAmount?: number | null;

  @QuoteItem.property({type: CountryTax})
  public taxType?: CountryTax;

  @QuoteItem.property()
  public quote?: Quote;

  public calculateSubTotal = (options?: CalculateOptions) => {
    const { strictEmbed = true } = options ? options : {};
    if (strictEmbed){
      if (this.unitPrice === undefined) {
        throw new Error('unitPrice is undefined, did you forget to embed it?');
      }
      if (this.quantity === undefined) {
        throw new Error('quantity is undefined, did you forget to embed it?');
      }
    }
    const quant = this.quantity ? this.quantity : 0;
    const unitPrice = this.unitPrice ? this.unitPrice : 0;
    return (quant * unitPrice).toFixed(3);
  };

  public calculateTaxAmount = (options?: CalculateOptions) => {
    const taxPercent = this.taxType && this.taxType.taxPercent ?
      this.taxType.taxPercent : 0;
    const taxRate = taxPercent ? Number(taxPercent) / 100 : 0;
    return (parseFloat(
      this.calculateSubTotal(options)) * taxRate).toFixed(3);
  };

  public calculateTotal = (options?: CalculateOptions) => {
    return (
      parseFloat(this.calculateSubTotal(options)) +
      parseFloat(this.calculateTaxAmount(options))
    ).toFixed(3);
  };

}
