import { Entity } from '../entity';

export class EmailCounter extends Entity {
  protected static resourceName = 'email_counters';
  protected static singularName = 'emailCounter';
  protected static pluralName = 'emailCounters';
  protected static primaryKey = 'emailAddress';

  @EmailCounter.property()
  public emailAddress?: string;

  @EmailCounter.property()
  public unsubscribed?: boolean;

  @EmailCounter.property()
  public silenced?: boolean;

  @EmailCounter.property()
  public tokens?: number;
}
