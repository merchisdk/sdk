import { Cart } from './cart';
import { Category } from './category';
import { Company } from './company';
import { DomainInvitation } from './domain_invitation';
import { DomainTag } from './domain_tag';
import { EnrolledDomain } from './enrolled_domain';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Invoice } from './invoice';
import { Job } from './job';
import { Menu } from './menu';
import { Notification } from './notification';
import { Product } from './product';
import { Session } from './session';
import { SupplyDomain } from './supply_domain';
import { Theme } from './theme';

export class Domain extends Entity {
  protected static resourceName: string = "domains";
  protected static singularName: string = "domain";
  protected static pluralName: string = "domains";

  @Domain.property()
  public archived?: Date | null;

  @Domain.property()
  public id?: number;

  @Domain.property()
  public domain?: string;

  @Domain.property()
  public isMaster?: boolean;

  @Domain.property()
  public domainType?: number;

  @Domain.property()
  public subDomain?: string;

  @Domain.property()
  public emailDomain?: string;

  @Domain.property()
  public smsName?: string;

  @Domain.property()
  public showDomainPublicly?: boolean;

  @Domain.property()
  public enableEmailNotifications?: boolean;

  @Domain.property()
  public enableSmsNotifications?: boolean;

  @Domain.property()
  public enableNotifications?: boolean;

  @Domain.property()
  public conversionTrackingCode?: string | null;

  @Domain.property()
  public newConversionTrackingCode?: string | null;

  @Domain.property()
  public newGlobalTrackingCode?: string | null;

  @Domain.property()
  public apiSecret?: string | null;

  @Domain.property()
  public company?: Company;

  @Domain.property()
  public logo?: MerchiFile | null;

  @Domain.property()
  public favicon?: MerchiFile | null;

  @Domain.property()
  public activeTheme?: Theme;

  @Domain.property("DomainTag")
  public tags?: Array<DomainTag>;

  @Domain.property("Domain")
  public canSupply?: Array<Domain>;

  @Domain.property("Domain")
  public suppliedBy?: Array<Domain>;

  @Domain.property("Menu")
  public menus?: Array<Menu>;

  @Domain.property("Session")
  public sessions?: Array<Session>;

  @Domain.property("Category")
  public categories?: Array<Category>;

  @Domain.property("Notification")
  public notifications?: Array<Notification>;

  @Domain.property("Product")
  public products?: Array<Product>;

  @Domain.property("SupplyDomain")
  public supplyProducts?: Array<SupplyDomain>;

  @Domain.property("Job")
  public jobs?: Array<Job>;

  @Domain.property("Cart")
  public carts?: Array<Cart>;

  @Domain.property("EnrolledDomain")
  public enrollments?: Array<EnrolledDomain>;

  @Domain.property("Invoice")
  public invoices?: Array<Invoice>;

  @Domain.property("DomainInvitation")
  public domainInvitations?: Array<DomainInvitation>;

  @Domain.property("Theme")
  public themes?: Array<Theme>;
}
