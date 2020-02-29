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
  protected static resourceName: string = 'domains';
  protected static singularName: string = 'domain';
  protected static pluralName: string = 'domains';

  @Domain.property({type: Date})
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

  @Domain.property({type: String})
  public conversionTrackingCode?: string | null;

  @Domain.property({type: String})
  public newConversionTrackingCode?: string | null;

  @Domain.property({type: String})
  public newGlobalTrackingCode?: string | null;

  @Domain.property({type: String})
  public apiSecret?: string | null;

  @Domain.property()
  public company?: Company;

  @Domain.property({type: MerchiFile})
  public logo?: MerchiFile | null;

  @Domain.property({type: MerchiFile})
  public favicon?: MerchiFile | null;

  @Domain.property()
  public activeTheme?: Theme;

  @Domain.property({arrayType: 'DomainTag'})
  public tags?: DomainTag[];

  @Domain.property({arrayType: 'Domain'})
  public canSupply?: Domain[];

  @Domain.property({arrayType: 'Domain'})
  public suppliedBy?: Domain[];

  @Domain.property({arrayType: 'Menu'})
  public menus?: Menu[];

  @Domain.property({arrayType: 'Session'})
  public sessions?: Session[];

  @Domain.property({arrayType: 'Category'})
  public categories?: Category[];

  @Domain.property({arrayType: 'Notification'})
  public notifications?: Notification[];

  @Domain.property({arrayType: 'Product'})
  public products?: Product[];

  @Domain.property({arrayType: 'SupplyDomain'})
  public supplyProducts?: SupplyDomain[];

  @Domain.property({arrayType: 'Job'})
  public jobs?: Job[];

  @Domain.property({arrayType: 'Cart'})
  public carts?: Cart[];

  @Domain.property({arrayType: 'EnrolledDomain'})
  public enrollments?: EnrolledDomain[];

  @Domain.property({arrayType: 'Invoice'})
  public invoices?: Invoice[];

  @Domain.property({arrayType: 'DomainInvitation'})
  public domainInvitations?: DomainInvitation[];

  @Domain.property({arrayType: 'Theme'})
  public themes?: Theme[];

  public defaultCurrency = () => {
    if (this.company === undefined) {
      throw new Error('company is undefined, did you forget to embed it?');
    }
    if (this.company.defaultCurrency === undefined) {
      const err = 'company.defaultCurrency is undefined, did you forget to' +
        ' embed it?'; 
      throw new Error(err);
    }
    return this.company.defaultCurrency;
  }

  public defaultTaxType = () => {
    if (this.company === undefined) {
      throw new Error('company is undefined, did you forget to embed it?');
    }
    if (this.company.defaultTaxType === undefined) {
      const err = 'company.defaultTaxType is undefined, did you forget to' +
        ' embed it?'; 
      throw new Error(err);
    }
    return this.company.defaultTaxType;
  }
}
