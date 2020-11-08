import { CountryTax } from './country_tax';
import { Entity } from '../entity';
import { Quote } from './quote';

export class QuoteItem extends Entity {
  protected static resourceName: string = 'quote_items';
  protected static singularName: string = 'quoteItem';
  protected static pluralName: string = 'quoteItems';

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
  public taxType?: CountryTax | null;

  @QuoteItem.property()
  public quote?: Quote;

  public total = () => {
    const quant = this.quantity ? this.quantity : 0;
    const unitPrice = this.unitPrice ? this.unitPrice : 0;
    return (quant * unitPrice).toFixed(3);
  }
}
