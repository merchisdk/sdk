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

  @Domain.property("archived")
  public archived?: Date | null;

  @Domain.property("id")
  public id?: number;

  @Domain.property("domain")
  public domain?: string;

  @Domain.property("isMaster")
  public isMaster?: boolean;

  @Domain.property("domainType")
  public domainType?: number;

  @Domain.property("subDomain")
  public subDomain?: string;

  @Domain.property("emailDomain")
  public emailDomain?: string;

  @Domain.property("smsName")
  public smsName?: string;

  @Domain.property("showDomainPublicly")
  public showDomainPublicly?: boolean;

  @Domain.property("enableEmailNotifications")
  public enableEmailNotifications?: boolean;

  @Domain.property("enableSmsNotifications")
  public enableSmsNotifications?: boolean;

  @Domain.property("enableNotifications")
  public enableNotifications?: boolean;

  @Domain.property("conversionTrackingCode")
  public conversionTrackingCode?: string | null;

  @Domain.property("newConversionTrackingCode")
  public newConversionTrackingCode?: string | null;

  @Domain.property("newGlobalTrackingCode")
  public newGlobalTrackingCode?: string | null;

  @Domain.property("apiSecret")
  public apiSecret?: string | null;

  @Domain.property("company")
  public company?: Company;

  @Domain.property("logo")
  public logo?: MerchiFile | null;

  @Domain.property("favicon")
  public favicon?: MerchiFile | null;

  @Domain.property("activeTheme")
  public activeTheme?: Theme;

  @Domain.property("tags", "DomainTag")
  public tags?: Array<DomainTag>;

  @Domain.property("canSupply", "Domain")
  public canSupply?: Array<Domain>;

  @Domain.property("suppliedBy", "Domain")
  public suppliedBy?: Array<Domain>;

  @Domain.property("menus", "Menu")
  public menus?: Array<Menu>;

  @Domain.property("sessions", "Session")
  public sessions?: Array<Session>;

  @Domain.property("categories", "Category")
  public categories?: Array<Category>;

  @Domain.property("notifications", "Notification")
  public notifications?: Array<Notification>;

  @Domain.property("products", "Product")
  public products?: Array<Product>;

  @Domain.property("supplyProducts", "SupplyDomain")
  public supplyProducts?: Array<SupplyDomain>;

  @Domain.property("jobs", "Job")
  public jobs?: Array<Job>;

  @Domain.property("carts", "Cart")
  public carts?: Array<Cart>;

  @Domain.property("enrollments", "EnrolledDomain")
  public enrollments?: Array<EnrolledDomain>;

  @Domain.property("invoices", "Invoice")
  public invoices?: Array<Invoice>;

  @Domain.property("domainInvitations", "DomainInvitation")
  public domainInvitations?: Array<DomainInvitation>;

  @Domain.property("themes", "Theme")
  public themes?: Array<Theme>;
}
