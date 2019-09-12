import { Backup } from './backup';
import { Company } from './company';
import { Component } from './component';
import { Domain } from './domain';
import { Draft } from './draft';
import { DraftComment } from './draft_comment';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { Job } from './job';
import { JobComment } from './job_comment';
import { Notification } from './notification';
import { Product } from './product';
import { ProductionComment } from './production_comment';
import { Theme } from './theme';
import { User } from './user';
import { Variation } from './variation';
import { VariationFieldsOption } from './variation_fields_option';

export class MerchiFile extends Entity {
  protected static resourceName: string = "files";
  protected static singularName: string = "file";
  protected static pluralName: string = "files";

  protected fileData?: File;

  public fromFormFile = (file: File) => {
    this.fileData = file;
  }

  @MerchiFile.property("archived")
  public archived?: Date | null;

  @MerchiFile.property("id")
  public id?: number;

  @MerchiFile.property("uploadId")
  public uploadId?: string;

  @MerchiFile.property("name")
  public name?: string | null;

  @MerchiFile.property("mimetype")
  public mimetype?: string | null;

  @MerchiFile.property("size")
  public size?: number;

  @MerchiFile.property("creationDate")
  public creationDate?: Date | null;

  @MerchiFile.property("cachedViewUrl")
  public cachedViewUrl?: string | null;

  @MerchiFile.property("viewUrlExpires")
  public viewUrlExpires?: Date | null;

  @MerchiFile.property("cachedDownloadUrl")
  public cachedDownloadUrl?: string | null;

  @MerchiFile.property("downloadUrlExpires")
  public downloadUrlExpires?: Date | null;

  @MerchiFile.property("uploader")
  public uploader?: User | null;

  @MerchiFile.property("viewUrl")
  public viewUrl?: string;

  @MerchiFile.property("downloadUrl")
  public downloadUrl?: string;

  @MerchiFile.property("components", "Component")
  public components?: Array<Component>;

  @MerchiFile.property("componentFeatureImages", "Component")
  public componentFeatureImages?: Array<Component>;

  @MerchiFile.property("draftComments", "DraftComment")
  public draftComments?: Array<DraftComment>;

  @MerchiFile.property("variations", "Variation")
  public variations?: Array<Variation>;

  @MerchiFile.property("backups", "Backup")
  public backups?: Array<Backup>;

  @MerchiFile.property("notification", "Notification")
  public notification?: Array<Notification>;

  @MerchiFile.property("companyLogos", "Company")
  public companyLogos?: Array<Company>;

  @MerchiFile.property("products", "Product")
  public products?: Array<Product>;

  @MerchiFile.property("featuredProducts", "Product")
  public featuredProducts?: Array<Product>;

  @MerchiFile.property("drafts", "Draft")
  public drafts?: Array<Draft>;

  @MerchiFile.property("options", "VariationFieldsOption")
  public options?: Array<VariationFieldsOption>;

  @MerchiFile.property("jobComments", "JobComment")
  public jobComments?: Array<JobComment>;

  @MerchiFile.property("jobs", "Job")
  public jobs?: Array<Job>;

  @MerchiFile.property("clientJobs", "Job")
  public clientJobs?: Array<Job>;

  @MerchiFile.property("domainLogos", "Domain")
  public domainLogos?: Array<Domain>;

  @MerchiFile.property("domainFavicons", "Domain")
  public domainFavicons?: Array<Domain>;

  @MerchiFile.property("userProfilePictures", "User")
  public userProfilePictures?: Array<User>;

  @MerchiFile.property("invoices", "Invoice")
  public invoices?: Array<Invoice>;

  @MerchiFile.property("invoicesPaid", "Invoice")
  public invoicesPaid?: Array<Invoice>;

  @MerchiFile.property("themeMainCss", "Theme")
  public themeMainCss?: Array<Theme>;

  @MerchiFile.property("themeMainCssUsing", "Theme")
  public themeMainCssUsing?: Array<Theme>;

  @MerchiFile.property("themeMainCssEditing", "Theme")
  public themeMainCssEditing?: Array<Theme>;

  @MerchiFile.property("themeEmailCss", "Theme")
  public themeEmailCss?: Array<Theme>;

  @MerchiFile.property("themeEmailCssUsing", "Theme")
  public themeEmailCssUsing?: Array<Theme>;

  @MerchiFile.property("themeEmailCssEditing", "Theme")
  public themeEmailCssEditing?: Array<Theme>;

  @MerchiFile.property("themes", "Theme")
  public themes?: Array<Theme>;

  @MerchiFile.property("themeFeatureImages", "Theme")
  public themeFeatureImages?: Array<Theme>;

  @MerchiFile.property("themeImages", "Theme")
  public themeImages?: Array<Theme>;

  @MerchiFile.property("productionComments", "ProductionComment")
  public productionComments?: Array<ProductionComment>;
}
