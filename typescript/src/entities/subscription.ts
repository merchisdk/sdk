import { Entity } from '../entity';
import { CountryTax } from './country_tax';
import { User } from './user';

export class Subscription extends Entity {
  protected static resourceName: string = 'subscriptions';
  protected static singularName: string = 'subscription';
  protected static pluralName: string = 'subscriptions';

  @Subscription.property()
  public id?: number;

  @Subscription.property({type: Date})
  public created?: Date | null;

  @Subscription.property({type: Date})
  public updated?: Date | null;

  @Subscription.property({type: User})
  public createdBy?: User | null;

  @Subscription.property({type: User})
  public updatedBy?: User | null;

  @Subscription.property()
  public name?: string;

  @Subscription.property()
  public currency?: string;

  @Subscription.property({type: CountryTax})
  public tax?: CountryTax | null;

  @Subscription.property()
  public baseCost?: number;

  @Subscription.property()
  public whiteLabelDomainCost?: number;

  @Subscription.property()
  public perSmsCost?: number;

  @Subscription.property()
  public perUserCost?: number;

  @Subscription.property()
  public perDomainCost?: number;

  @Subscription.property()
  public baseUserCount?: number;

  @Subscription.property()
  public baseDomainCount?: number;

  @Subscription.property()
  public billingCycleDays?: number;

  @Subscription.property()
  public private?: boolean;
