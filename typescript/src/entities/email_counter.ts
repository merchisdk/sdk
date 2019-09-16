import { Entity } from '../entity';

export class EmailCounter extends Entity {
  protected static resourceName: string = "email_counters";
  protected static singularName: string = "emailCounter";
  protected static pluralName: string = "emailCounters";
  protected static primaryKey: string = "emailAddress";

  @EmailCounter.property()
  public emailAddress?: string;

  @EmailCounter.property()
  public unsubscribed?: boolean;

  @EmailCounter.property()
  public silenced?: boolean;

  @EmailCounter.property()
  public tokens?: number;
}
