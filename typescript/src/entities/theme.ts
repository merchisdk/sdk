import { Component } from './component';
import { Domain } from './domain';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { InternalTag } from './internal_tag';
import { User } from './user';
import { Menu } from './menu';
import { Page } from './page';
import { ThemeStatus } from '../constants/theme_status';

export class Theme extends Entity {
  protected static resourceName = 'themes';
  protected static singularName = 'theme';
  protected static pluralName = 'themes';

  @Theme.property({type: Date})
  public archived?: Date | null;

  @Theme.property()
  public id?: number;

  @Theme.property()
  public foundation?: number;

  @Theme.property({arrayType: 'InternalTag'})
  public internalTags?: InternalTag[];

  @Theme.property({arrayType: 'Component'})
  public components?: Component[];

  @Theme.property({arrayType: 'Component'})
  public contextComponents?: Component[];

  @Theme.property()
  public mainCssStatus?: number;

  @Theme.property({type: String})
  public mainCssErrorMessage?: string | null;

  @Theme.property()
  public emailCssStatus?: number;

  @Theme.property({type: String})
  public emailCssErrorMessage?: string | null;

  @Theme.property()
  public name?: string;

  @Theme.property()
  public description?: string;

  @Theme.property()
  public jsBundle?: string;

  @Theme.property()
  public headerTemplate?: string;

  @Theme.property({type: String})
  public headerError?: string | null;

  @Theme.property()
  public headerHtml?: string;

  @Theme.property()
  public footerTemplate?: string;

  @Theme.property({type: String})
  public footerError?: string | null;

  @Theme.property()
  public footerHtml?: string;

  @Theme.property()
  public indexPageTemplate?: string;

  @Theme.property({type: String})
  public indexPageError?: string | null;

  @Theme.property()
  public indexHtml?: string;

  @Theme.property({arrayType: 'Menu'})
  public menus?: Menu[];

  @Theme.property()
  public productsPageTemplate?: string;

  @Theme.property({type: String})
  public productsPageError?: string | null;

  @Theme.property()
  public productsHtml?: string;

  @Theme.property({type: String})
  public domainInvitePageTemplate?: string | null;

  @Theme.property({type: String})
  public domainInvitePageError?: string | null;

  @Theme.property()
  public domainInviteHtml?: string;

  @Theme.property({type: String})
  public resetPasswordPageTemplate?: string | null;

  @Theme.property({type: String})
  public resetPasswordPageError?: string | null;

  @Theme.property()
  public passwordResetHtml?: string;

  @Theme.property({type: String})
  public passwordChangePageTemplate?: string | null;

  @Theme.property({type: String})
  public passwordChangePageError?: string | null;

  @Theme.property()
  public passwordChangeHtml?: string;

  @Theme.property({type: String})
  public jobDraftingPageTemplate?: string | null;

  @Theme.property({type: String})
  public jobDraftingPageError?: string | null;

  @Theme.property()
  public jobDraftingHtml?: string;

  @Theme.property({type: String})
  public jobQuoteRequestedPageTemplate?: string | null;

  @Theme.property({type: String})
  public jobQuoteRequestedPageError?: string | null;

  @Theme.property()
  public jobQuoteRequestedHtml?: string;

  @Theme.property({type: String})
  public invoicePageTemplate?: string | null;

  @Theme.property({type: String})
  public invoicePageError?: string | null;

  @Theme.property()
  public invoiceHtml?: string;

  @Theme.property({type: String})
  public loginPageTemplate?: string | null;

  @Theme.property({type: String})
  public loginPageError?: string | null;

  @Theme.property()
  public loginPageHtml?: string;

  @Theme.property({type: String})
  public errorPageTemplate?: string | null;

  @Theme.property({type: String})
  public errorPageError?: string | null;

  @Theme.property()
  public errorPageHtml?: string;

  @Theme.property({type: String})
  public userProfilePageTemplate?: string | null;

  @Theme.property({type: String})
  public userProfilePageError?: string | null;

  @Theme.property()
  public userProfileHtml?: string;

  @Theme.property({type: String})
  public productPageTemplate?: string | null;

  @Theme.property({type: String})
  public productPageError?: string | null;

  @Theme.property()
  public productHtml?: string;

  @Theme.property({type: String})
  public invoicePaidPageTemplate?: string | null;

  @Theme.property({type: String})
  public invoicePaidPageError?: string | null;

  @Theme.property()
  public invoicePaidHtml?: string;

  @Theme.property()
  public lastUpdated?: Date;

  @Theme.property()
  public public?: boolean;

  @Theme.property({type: String})
  public aiContext?: string;

  @Theme.property({embeddedByDefault: false, type: String})
  public mainCss?: string | null;

  @Theme.property({embeddedByDefault: false, type: String})
  public mainCssTemplateUsing?: string | null;

  @Theme.property({embeddedByDefault: false, type: String})
  public mainCssTemplateEditing?: string | null;

  @Theme.property({embeddedByDefault: false, type: String})
  public emailCss?: string | null;

  @Theme.property({embeddedByDefault: false, type: String})
  public emailCssTemplateUsing?: string | null;

  @Theme.property({embeddedByDefault: false, type: String})
  public emailCssTemplateEditing?: string | null;

  @Theme.property({arrayType: 'MerchiFile'})
  public cssImageFiles?: MerchiFile[];

  @Theme.property({type: MerchiFile})
  public featureImage?: MerchiFile | null;

  @Theme.property({type: 'Domain'})
  public domain?: Domain | null;

  @Theme.property({type: User})
  public author?: User | null;

  @Theme.property({arrayType: 'MerchiFile'})
  public images?: MerchiFile[];

  @Theme.property({arrayType: 'Domain'})
  public domains?: Domain[];

  @Theme.property({arrayType: 'Page'})
  public pages?: Page[];

  @Theme.property({type: Number})
  public defaultForDomainType?: number | null;

  public canBeActivated = () => {
    const validStatus = ThemeStatus.VALID_BUT_NOT_UPDATED;
    if (this.mainCssStatus === undefined || this.emailCssStatus === undefined) {
      throw new Error('status is unknown');
    }
    return this.mainCssStatus >= validStatus &&
      this.emailCssStatus >= validStatus;
  };

  public isActiveOnDomain = (domainId: number) => {
    const domain = this.domain;
    if (domain === undefined) {
      throw new Error('domain is unknown');
    }
    if (domain === null) {
      return false;
    }
    const activeTheme = domain.activeTheme;
    if (activeTheme === undefined) {
      throw new Error('activeTheme is unknown');
    }
    return domain.id == domainId && activeTheme.id === this.id;
  };
}
