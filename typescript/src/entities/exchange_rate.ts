import { Entity } from '../entity';

export class ExchangeRate extends Entity {
  protected static resourceName: string = 'exchange_rates';
  protected static singularName: string = 'exchangeRate';
  protected static pluralName: string = 'exchangeRates';

  @ExchangeRate.property()
  public id?: number;

  @ExchangeRate.property()
  public fromCurrency?: string;

  @ExchangeRate.property()
  public toCurrency?: string;

  @ExchangeRate.property()
  public rate?: number;

  @ExchangeRate.property()
  public lastUpdated?: Date;
}
