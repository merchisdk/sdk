import { Domain } from './domain';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { User } from './user';
import { ThemeStatus } from '../constants/theme_status';

export class Theme extends Entity {
  protected static resourceName: string = 'themes';
  protected static singularName: string = 'theme';
  protected static pluralName: string = 'themes';

  @Theme.property()
  public archived?: Date | null;

  @Theme.property()
  public id?: number;

  @Theme.property()
  public mainCssStatus?: number;

  @Theme.property()
  public mainCssErrorMessage?: string | null;

  @Theme.property()
  public emailCssStatus?: number;

  @Theme.property()
  public emailCssErrorMessage?: string | null;

  @Theme.property()
  public name?: string;

  @Theme.property()
  public description?: string;

  @Theme.property()
  public headerTemplate?: string;

  @Theme.property()
  public headerError?: string | null;

  @Theme.property()
  public headerHtml?: string;

  @Theme.property()
  public headerJs?: string;

  @Theme.property()
  public footerTemplate?: string;

  @Theme.property()
  public footerError?: string | null;

  @Theme.property()
  public footerHtml?: string;

  @Theme.property()
  public footerJs?: string;

  @Theme.property()
  public indexPageTemplate?: string;

  @Theme.property()
  public indexPageError?: string | null;

  @Theme.property()
  public indexHtml?: string;

  @Theme.property()
  public indexJs?: string;

  @Theme.property()
  public invoicesPageTemplate?: string;

  @Theme.property()
  public invoicesPageError?: string | null;

  @Theme.property()
  public invoicesHtml?: string;

  @Theme.property()
  public invoicesJs?: string;

  @Theme.property()
  public productsPageTemplate?: string;

  @Theme.property()
  public productsPageError?: string | null;

  @Theme.property()
  public productsHtml?: string;

  @Theme.property()
  public productsJs?: string;

  @Theme.property()
  public domainInvitePageTemplate?: string | null;

  @Theme.property()
  public domainInvitePageError?: string | null;

  @Theme.property()
  public domainInviteHtml?: string;

  @Theme.property()
  public domainInviteJs?: string;

  @Theme.property()
  public resetPasswordPageTemplate?: string | null;

  @Theme.property()
  public resetPasswordPageError?: string | null;

  @Theme.property()
  public passwordResetHtml?: string;

  @Theme.property()
  public passwordResetJs?: string;

  @Theme.property()
  public passwordChangePageTemplate?: string | null;

  @Theme.property()
  public passwordChangePageError?: string | null;

  @Theme.property()
  public passwordChangeHtml?: string;

  @Theme.property()
  public passwordChangeJs?: string;

  @Theme.property()
  public smsLoginPageTemplate?: string | null;

  @Theme.property()
  public smsLoginPageError?: string | null;

  @Theme.property()
  public smsLoginHtml?: string;

  @Theme.property()
  public smsLoginJs?: string;

  @Theme.property()
  public smsTokenPageTemplate?: string | null;

  @Theme.property()
  public smsTokenPageError?: string | null;

  @Theme.property()
  public smsTokenHtml?: string;

  @Theme.property()
  public smsTokenJs?: string;

  @Theme.property()
  public jobsPageTemplate?: string | null;

  @Theme.property()
  public jobsPageError?: string | null;

  @Theme.property()
  public jobsHtml?: string;

  @Theme.property()
  public jobsJs?: string;

  @Theme.property()
  public jobDraftingPageTemplate?: string | null;

  @Theme.property()
  public jobDraftingPageError?: string | null;

  @Theme.property()
  public jobDraftingHtml?: string;

  @Theme.property()
  public jobDraftingJs?: string;

  @Theme.property()
  public jobQuoteRequestedPageTemplate?: string | null;

  @Theme.property()
  public jobQuoteRequestedPageError?: string | null;

  @Theme.property()
  public jobQuoteRequestedHtml?: string;

  @Theme.property()
  public jobQuoteRequestedJs?: string;

  @Theme.property()
  public draftPreviewPageTemplate?: string | null;

  @Theme.property()
  public draftPreviewPageError?: string | null;

  @Theme.property()
  public draftPreviewHtml?: string;

  @Theme.property()
  public draftPreviewJs?: string;

  @Theme.property()
  public invoicePageTemplate?: string | null;

  @Theme.property()
  public invoicePageError?: string | null;

  @Theme.property()
  public invoiceHtml?: string;

  @Theme.property()
  public invoiceJs?: string;

  @Theme.property()
  public userProfilePageTemplate?: string | null;

  @Theme.property()
  public userProfilePageError?: string | null;

  @Theme.property()
  public userProfileHtml?: string;

  @Theme.property()
  public userProfileJs?: string;

  @Theme.property()
  public companyProfilePageTemplate?: string | null;

  @Theme.property()
  public companyProfilePageError?: string | null;

  @Theme.property()
  public companyProfileHtml?: string;

  @Theme.property()
  public companyProfileJs?: string;

  @Theme.property()
  public productPageTemplate?: string | null;

  @Theme.property()
  public productPageError?: string | null;

  @Theme.property()
  public productHtml?: string;

  @Theme.property()
  public productJs?: string;

  @Theme.property()
  public invoicePaidPageTemplate?: string | null;

  @Theme.property()
  public invoicePaidPageError?: string | null;

  @Theme.property()
  public invoicePaidHtml?: string;

  @Theme.property()
  public invoicePaidJs?: string;

  @Theme.property()
  public lastUpdated?: Date;

  @Theme.property()
  public public?: boolean;

  @Theme.property()
  public mainCssFile?: MerchiFile | null;

  @Theme.property()
  public mainCssTemplateUsing?: MerchiFile | null;

  @Theme.property()
  public mainCssTemplateEditing?: MerchiFile | null;

  @Theme.property()
  public emailCssFile?: MerchiFile | null;

  @Theme.property()
  public emailCssTemplateUsing?: MerchiFile | null;

  @Theme.property()
  public emailCssTemplateEditing?: MerchiFile | null;

  @Theme.property({ arrayType: 'MerchiFile' })
  public cssImageFiles?: Array<MerchiFile>;

  @Theme.property()
  public featureImage?: MerchiFile | null;

  @Theme.property()
  public domain?: Domain | null;

  @Theme.property()
  public author?: User | null;

  @Theme.property({ arrayType: 'MerchiFile' })
  public images?: Array<MerchiFile>;

  @Theme.property({ arrayType: 'Domain' })
  public domains?: Array<Domain>;

  public canBeActivated = () => {
    const validStatus = ThemeStatus.VALID_BUT_NOT_UPDATED;
    if (this.mainCssStatus === undefined || this.emailCssStatus === undefined) {
      throw new Error('status is unknown');
    }
    return (
      this.mainCssStatus >= validStatus && this.emailCssStatus >= validStatus
    );
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
