import { Domain } from './domain';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { User } from './user';

export class Theme extends Entity {
  protected static resourceName: string = "themes";
  protected static singularName: string = "theme";
  protected static pluralName: string = "themes";

  @Theme.property("archived")
  public archived?: Date | null;

  @Theme.property("id")
  public id?: number;

  @Theme.property("mainCssStatus")
  public mainCssStatus?: number;

  @Theme.property("mainCssErrorMessage")
  public mainCssErrorMessage?: string | null;

  @Theme.property("emailCssStatus")
  public emailCssStatus?: number;

  @Theme.property("emailCssErrorMessage")
  public emailCssErrorMessage?: string | null;

  @Theme.property("name")
  public name?: string;

  @Theme.property("description")
  public description?: string;

  @Theme.property("headerTemplate")
  public headerTemplate?: string;

  @Theme.property("headerError")
  public headerError?: string | null;

  @Theme.property("headerHtml")
  public headerHtml?: string;

  @Theme.property("headerJs")
  public headerJs?: string;

  @Theme.property("footerTemplate")
  public footerTemplate?: string;

  @Theme.property("footerError")
  public footerError?: string | null;

  @Theme.property("footerHtml")
  public footerHtml?: string;

  @Theme.property("footerJs")
  public footerJs?: string;

  @Theme.property("indexPageTemplate")
  public indexPageTemplate?: string;

  @Theme.property("indexPageError")
  public indexPageError?: string | null;

  @Theme.property("indexHtml")
  public indexHtml?: string;

  @Theme.property("indexJs")
  public indexJs?: string;

  @Theme.property("invoicesPageTemplate")
  public invoicesPageTemplate?: string;

  @Theme.property("invoicesPageError")
  public invoicesPageError?: string | null;

  @Theme.property("invoicesHtml")
  public invoicesHtml?: string;

  @Theme.property("invoicesJs")
  public invoicesJs?: string;

  @Theme.property("productsPageTemplate")
  public productsPageTemplate?: string;

  @Theme.property("productsPageError")
  public productsPageError?: string | null;

  @Theme.property("productsHtml")
  public productsHtml?: string;

  @Theme.property("productsJs")
  public productsJs?: string;

  @Theme.property("domainInvitePageTemplate")
  public domainInvitePageTemplate?: string | null;

  @Theme.property("domainInvitePageError")
  public domainInvitePageError?: string | null;

  @Theme.property("domainInviteHtml")
  public domainInviteHtml?: string;

  @Theme.property("domainInviteJs")
  public domainInviteJs?: string;

  @Theme.property("resetPasswordPageTemplate")
  public resetPasswordPageTemplate?: string | null;

  @Theme.property("resetPasswordPageError")
  public resetPasswordPageError?: string | null;

  @Theme.property("passwordResetHtml")
  public passwordResetHtml?: string;

  @Theme.property("passwordResetJs")
  public passwordResetJs?: string;

  @Theme.property("passwordChangePageTemplate")
  public passwordChangePageTemplate?: string | null;

  @Theme.property("passwordChangePageError")
  public passwordChangePageError?: string | null;

  @Theme.property("passwordChangeHtml")
  public passwordChangeHtml?: string;

  @Theme.property("passwordChangeJs")
  public passwordChangeJs?: string;

  @Theme.property("smsLoginPageTemplate")
  public smsLoginPageTemplate?: string | null;

  @Theme.property("smsLoginPageError")
  public smsLoginPageError?: string | null;

  @Theme.property("smsLoginHtml")
  public smsLoginHtml?: string;

  @Theme.property("smsLoginJs")
  public smsLoginJs?: string;

  @Theme.property("smsTokenPageTemplate")
  public smsTokenPageTemplate?: string | null;

  @Theme.property("smsTokenPageError")
  public smsTokenPageError?: string | null;

  @Theme.property("smsTokenHtml")
  public smsTokenHtml?: string;

  @Theme.property("smsTokenJs")
  public smsTokenJs?: string;

  @Theme.property("jobsPageTemplate")
  public jobsPageTemplate?: string | null;

  @Theme.property("jobsPageError")
  public jobsPageError?: string | null;

  @Theme.property("jobsHtml")
  public jobsHtml?: string;

  @Theme.property("jobsJs")
  public jobsJs?: string;

  @Theme.property("jobDraftingPageTemplate")
  public jobDraftingPageTemplate?: string | null;

  @Theme.property("jobDraftingPageError")
  public jobDraftingPageError?: string | null;

  @Theme.property("jobDraftingHtml")
  public jobDraftingHtml?: string;

  @Theme.property("jobDraftingJs")
  public jobDraftingJs?: string;

  @Theme.property("jobQuoteRequestedPageTemplate")
  public jobQuoteRequestedPageTemplate?: string | null;

  @Theme.property("jobQuoteRequestedPageError")
  public jobQuoteRequestedPageError?: string | null;

  @Theme.property("jobQuoteRequestedHtml")
  public jobQuoteRequestedHtml?: string;

  @Theme.property("jobQuoteRequestedJs")
  public jobQuoteRequestedJs?: string;

  @Theme.property("draftPreviewPageTemplate")
  public draftPreviewPageTemplate?: string | null;

  @Theme.property("draftPreviewPageError")
  public draftPreviewPageError?: string | null;

  @Theme.property("draftPreviewHtml")
  public draftPreviewHtml?: string;

  @Theme.property("draftPreviewJs")
  public draftPreviewJs?: string;

  @Theme.property("invoicePageTemplate")
  public invoicePageTemplate?: string | null;

  @Theme.property("invoicePageError")
  public invoicePageError?: string | null;

  @Theme.property("invoiceHtml")
  public invoiceHtml?: string;

  @Theme.property("invoiceJs")
  public invoiceJs?: string;

  @Theme.property("userProfilePageTemplate")
  public userProfilePageTemplate?: string | null;

  @Theme.property("userProfilePageError")
  public userProfilePageError?: string | null;

  @Theme.property("userProfileHtml")
  public userProfileHtml?: string;

  @Theme.property("userProfileJs")
  public userProfileJs?: string;

  @Theme.property("companyProfilePageTemplate")
  public companyProfilePageTemplate?: string | null;

  @Theme.property("companyProfilePageError")
  public companyProfilePageError?: string | null;

  @Theme.property("companyProfileHtml")
  public companyProfileHtml?: string;

  @Theme.property("companyProfileJs")
  public companyProfileJs?: string;

  @Theme.property("productPageTemplate")
  public productPageTemplate?: string | null;

  @Theme.property("productPageError")
  public productPageError?: string | null;

  @Theme.property("productHtml")
  public productHtml?: string;

  @Theme.property("productJs")
  public productJs?: string;

  @Theme.property("invoicePaidPageTemplate")
  public invoicePaidPageTemplate?: string | null;

  @Theme.property("invoicePaidPageError")
  public invoicePaidPageError?: string | null;

  @Theme.property("invoicePaidHtml")
  public invoicePaidHtml?: string;

  @Theme.property("invoicePaidJs")
  public invoicePaidJs?: string;

  @Theme.property("lastUpdated")
  public lastUpdated?: Date;

  @Theme.property("public")
  public public?: boolean;

  @Theme.property("mainCssFile")
  public mainCssFile?: MerchiFile | null;

  @Theme.property("mainCssTemplateUsing")
  public mainCssTemplateUsing?: MerchiFile | null;

  @Theme.property("mainCssTemplateEditing")
  public mainCssTemplateEditing?: MerchiFile | null;

  @Theme.property("emailCssFile")
  public emailCssFile?: MerchiFile | null;

  @Theme.property("emailCssTemplateUsing")
  public emailCssTemplateUsing?: MerchiFile | null;

  @Theme.property("emailCssTemplateEditing")
  public emailCssTemplateEditing?: MerchiFile | null;

  @Theme.property("cssImageFiles", "MerchiFile")
  public cssImageFiles?: Array<MerchiFile>;

  @Theme.property("featureImage")
  public featureImage?: MerchiFile | null;

  @Theme.property("domain")
  public domain?: Domain | null;

  @Theme.property("author")
  public author?: User | null;

  @Theme.property("images", "MerchiFile")
  public images?: Array<MerchiFile>;

  @Theme.property("domains", "Domain")
  public domains?: Array<Domain>;
}
