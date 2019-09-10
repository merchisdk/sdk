import { Entity } from '../entity';
import { Notification } from './notification';
import { User } from './user';

export class ShortUrl extends Entity {
  protected static resourceName: string = "short_urls";
  protected static singularName: string = "shortUrl";
  protected static pluralName: string = "shortUrls";

  @ShortUrl.property("archived")
  public archived?: Date | null;

  @ShortUrl.property("id")
  public id?: number;

  @ShortUrl.property("prefixToken")
  public prefixToken?: string;

  @ShortUrl.property("suffixToken")
  public suffixToken?: string;

  @ShortUrl.property("originalLink")
  public originalLink?: string;

  @ShortUrl.property("triedTimes")
  public triedTimes?: number;

  @ShortUrl.property("lastLookup")
  public lastLookup?: Date | null;

  @ShortUrl.property("user")
  public user?: User | null;

  @ShortUrl.property("notification", "Notification")
  public notification?: Array<Notification>;
}
