import { Entity } from '../entity';
import { CountryTax } from './country_tax';
import { User } from './user';
import { Company } from './company';

export class SubscriptionPlan extends Entity {
  protected static resourceName = 'subscription_plans';
  protected static singularName = 'subscriptionPlan';
  protected static pluralName = 'subscriptionPlans';

  @SubscriptionPlan.property()
  public id?: number;

  @SubscriptionPlan.property({type: Date})
  public created?: Date | null;

  @SubscriptionPlan.property({type: Date})
  public updated?: Date | null;

  @SubscriptionPlan.property({type: User})
  public createdBy?: User | null;

  @SubscriptionPlan.property({type: User})
  public updatedBy?: User | null;

  @SubscriptionPlan.property()
  public name?: string;

  @SubscriptionPlan.property()
  public currency?: string;

  @SubscriptionPlan.property({type: CountryTax})
  public tax?: CountryTax | null;

  @SubscriptionPlan.property()
  public baseCost?: number;

  @SubscriptionPlan.property()
  public whiteLabelDomainCost?: number;

  @SubscriptionPlan.property()
  public perSmsCost?: number;

  @SubscriptionPlan.property()
  public perUserCost?: number;

  @SubscriptionPlan.property()
  public perDomainCost?: number;

  @SubscriptionPlan.property()
  public transactionCost?: number;

  @SubscriptionPlan.property()
  public commissionRate?: number;

  @SubscriptionPlan.property()
  public baseUserCount?: number;

  @SubscriptionPlan.property()
  public baseDomainCount?: number;

  @SubscriptionPlan.property()
  public billingCycleDays?: number;

  @SubscriptionPlan.property()
  public isPrivate?: boolean;

  @SubscriptionPlan.property()
  public showPublic?: boolean;

  @SubscriptionPlan.property({arrayType: 'Company'})
  public companies?: Company[];
}
