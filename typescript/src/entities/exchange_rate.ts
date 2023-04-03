import { Entity } from '../entity';

export class ExchangeRate extends Entity {
  protected static resourceName = 'exchange_rates';
  protected static singularName = 'exchangeRate';
  protected static pluralName = 'exchangeRates';

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
