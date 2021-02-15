import { Entity } from '../entity';
import { Notification } from './notification';
import { User } from './user';

export class ShortUrl extends Entity {
  protected static resourceName: string = 'short_urls';
  protected static singularName: string = 'shortUrl';
  protected static pluralName: string = 'shortUrls';

  @ShortUrl.property({type: Date})
  public archived?: Date | null;

  @ShortUrl.property()
  public id?: number;

  @ShortUrl.property()
  public prefixToken?: string;

  @ShortUrl.property()
  public suffixToken?: string;

  @ShortUrl.property()
  public originalLink?: string;

  @ShortUrl.property()
  public triedTimes?: number;

  @ShortUrl.property({type: Date})
  public lastLookup?: Date | null;

  @ShortUrl.property({type: User})
  public user?: User | null;

  @ShortUrl.property({arrayType: 'Notification'})
  public notification?: Notification[];
}
