import { Cart } from './cart';
import { Category } from './category';
import { Company } from './company';
import { DomainInvitation } from './domain_invitation';
import { DomainTag } from './domain_tag';
import { EnrolledDomain } from './enrolled_domain';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { InternalTag } from './internal_tag';
import { Invoice } from './invoice';
import { Job } from './job';
import { Menu } from './menu';
import { User } from './user';
import { Notification } from './notification';
import { Product } from './product';
import { Session } from './session';
import { SupplyDomain } from './supply_domain';
import { SeoDomainPage } from './seo_domain_page';
import { Theme } from './theme';
import { DomainType } from '../constants/domain_types';

export class Domain extends Entity {
  protected static resourceName = 'domains';
  protected static singularName = 'domain';
  protected static pluralName = 'domains';

  @Domain.property({type: Date})
  public archived?: Date | null;

  @Domain.property()
  public id?: number;

  @Domain.property()
  public domain?: string;

  @Domain.property()
  public country?: string;

  @Domain.property()
  public currency?: string;

  @Domain.property()
  public callToActions?: string;

  @Domain.property()
  public callToActionDetails?: any[];

  @Domain.property()
  public isMaster?: boolean;

  @Domain.property()
  public internalUseNotes?: string;

  @Domain.property()
  public internalUseAiContext?: string;

  @Domain.property()
  public aiContext?: string;

  @Domain.property()
  public domainType?: DomainType;

  @Domain.property()
  public subDomain?: string;

  @Domain.property()
  public emailDomain?: string;

  @Domain.property()
  public smsName?: string;

  @Domain.property()
  public showDomainPublicly?: boolean;

  @Domain.property()
  public publicAccessRestricted?: boolean;

  @Domain.property()
  public showDomainToAccessibleEntitiesOnly?: boolean;

  @Domain.property()
  public enableEmailNotifications?: boolean;

  @Domain.property()
  public enableSmsNotifications?: boolean;

  @Domain.property()
  public mailgunRecords?: any[];

  @Domain.property()
  public enableNotifications?: boolean;

  @Domain.property({type: String})
  public trackingCodeGoogleConversion?: string | null;

  @Domain.property({type: String})
  public trackingCodeGoogleGlobal?: string | null;

  @Domain.property({type: String})
  public apiSecret?: string | null;

  @Domain.property({type: String})
  public webflowApiKey?: string | null;

  @Domain.property({type: String})
  public shopifyShopUrl?: string | null;

  @Domain.property()
  public shopifyIsActive?: boolean;

  @Domain.property({type: String})
  public qrShopQrCode?: string | null;

  @Domain.property({type: String})
  public unltdAiApiOrganizationId?: string;

  @Domain.property({type: String})
  public unltdAiApiSecretKey?: string;

  @Domain.property({type: String})
  public socialBitchute?: string | null;

  @Domain.property({type: String})
  public socialDiscord?: string | null;

  @Domain.property({type: String})
  public socialFacebook?: string | null;

  @Domain.property({type: String})
  public socialGoogle?: string | null;

  @Domain.property({type: String})
  public socialInstagram?: string | null;

  @Domain.property({type: String})
  public socialLinkedin?: string | null;

  @Domain.property({type: String})
  public socialRumble?: string | null;

  @Domain.property({type: String})
  public socialTelegram?: string | null;

  @Domain.property({type: String})
  public socialTiktok?: string | null;

  @Domain.property({type: String})
  public socialX?: string | null;

  @Domain.property({type: String})
  public socialYoutube?: string | null;

  @Domain.property()
  public ownedBy?: Company;

  @Domain.property()
  public company?: Company;

  @Domain.property({type: MerchiFile})
  public logo?: MerchiFile | null;

  @Domain.property({type: MerchiFile})
  public favicon?: MerchiFile | null;

  @Domain.property()
  public activeTheme?: Theme;

  @Domain.property({arrayType: 'InternalTag'})
  public internalTags?: InternalTag[];

  @Domain.property({arrayType: 'DomainTag'})
  public tags?: DomainTag[];

  @Domain.property({arrayType: 'Domain'})
  public canSupply?: Domain[];

  @Domain.property({arrayType: 'Domain'})
  public suppliedBy?: Domain[];

  @Domain.property({arrayType: 'User'})
  public accessibleClients?: User[];

  @Domain.property({arrayType: 'Company'})
  public accessibleClientCompanies?: Company[];

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

  @Domain.property({arrayType: 'User'})
  public jobsAssignees?: User[];

  @Domain.property({arrayType: 'Cart'})
  public carts?: Cart[];

  @Domain.property({arrayType: 'EnrolledDomain'})
  public enrollments?: EnrolledDomain[];

  @Domain.property({arrayType: 'Invoice'})
  public invoices?: Invoice[];

  @Domain.property({arrayType: 'DomainInvitation'})
  public domainInvitations?: DomainInvitation[];

  @Domain.property({arrayType: 'SeoDomainPage'})
  public seoDomainPages?: SeoDomainPage[];

  @Domain.property({arrayType: 'Theme'})
  public themes?: Theme[];

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
  };

  public getActiveTheme = (): Theme => {
    if (this.activeTheme === undefined) {
      throw new Error('activeTheme is undefined, did you forget to embed it?');
    }
    return this.activeTheme!;
  };
}
