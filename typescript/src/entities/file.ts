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

  @MerchiFile.property()
  public archived?: Date | null;

  @MerchiFile.property()
  public id?: number;

  @MerchiFile.property()
  public uploadId?: string;

  @MerchiFile.property()
  public name?: string | null;

  @MerchiFile.property()
  public mimetype?: string | null;

  @MerchiFile.property()
  public size?: number;

  @MerchiFile.property()
  public creationDate?: Date | null;

  @MerchiFile.property()
  public cachedViewUrl?: string | null;

  @MerchiFile.property()
  public viewUrlExpires?: Date | null;

  @MerchiFile.property()
  public cachedDownloadUrl?: string | null;

  @MerchiFile.property()
  public downloadUrlExpires?: Date | null;

  @MerchiFile.property()
  public uploader?: User | null;

  @MerchiFile.property()
  public viewUrl?: string;

  @MerchiFile.property()
  public downloadUrl?: string;

  @MerchiFile.property("Component")
  public components?: Array<Component>;

  @MerchiFile.property("Component")
  public componentFeatureImages?: Array<Component>;

  @MerchiFile.property("DraftComment")
  public draftComments?: Array<DraftComment>;

  @MerchiFile.property("Variation")
  public variations?: Array<Variation>;

  @MerchiFile.property("Backup")
  public backups?: Array<Backup>;

  @MerchiFile.property("Notification")
  public notification?: Array<Notification>;

  @MerchiFile.property("Company")
  public companyLogos?: Array<Company>;

  @MerchiFile.property("Product")
  public products?: Array<Product>;

  @MerchiFile.property("Product")
  public featuredProducts?: Array<Product>;

  @MerchiFile.property("Draft")
  public drafts?: Array<Draft>;

  @MerchiFile.property("VariationFieldsOption")
  public options?: Array<VariationFieldsOption>;

  @MerchiFile.property("JobComment")
  public jobComments?: Array<JobComment>;

  @MerchiFile.property("Job")
  public jobs?: Array<Job>;

  @MerchiFile.property("Job")
  public clientJobs?: Array<Job>;

  @MerchiFile.property("Domain")
  public domainLogos?: Array<Domain>;

  @MerchiFile.property("Domain")
  public domainFavicons?: Array<Domain>;

  @MerchiFile.property("User")
  public userProfilePictures?: Array<User>;

  @MerchiFile.property("Invoice")
  public invoices?: Array<Invoice>;

  @MerchiFile.property("Invoice")
  public invoicesPaid?: Array<Invoice>;

  @MerchiFile.property("Theme")
  public themeMainCss?: Array<Theme>;

  @MerchiFile.property("Theme")
  public themeMainCssUsing?: Array<Theme>;

  @MerchiFile.property("Theme")
  public themeMainCssEditing?: Array<Theme>;

  @MerchiFile.property("Theme")
  public themeEmailCss?: Array<Theme>;

  @MerchiFile.property("Theme")
  public themeEmailCssUsing?: Array<Theme>;

  @MerchiFile.property("Theme")
  public themeEmailCssEditing?: Array<Theme>;

  @MerchiFile.property("Theme")
  public themes?: Array<Theme>;

  @MerchiFile.property("Theme")
  public themeFeatureImages?: Array<Theme>;

  @MerchiFile.property("Theme")
  public themeImages?: Array<Theme>;

  @MerchiFile.property("ProductionComment")
  public productionComments?: Array<ProductionComment>;
}
