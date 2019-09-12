import { Entity } from '../entity';

export class EmailCounter extends Entity {
  protected static resourceName: string = "email_counters";
  protected static singularName: string = "emailCounter";
  protected static pluralName: string = "emailCounters";
  protected static primaryKey: string = "emailAddress";

  @EmailCounter.property("emailAddress")
  public emailAddress?: string;

  @EmailCounter.property("unsubscribed")
  public unsubscribed?: boolean;

  @EmailCounter.property("silenced")
  public silenced?: boolean;

  @EmailCounter.property("tokens")
  public tokens?: number;
}
