import { Address } from './address';
import { Assignment } from './assignment';
import { Company } from './company';
import { CountryTax } from './country_tax';
import { Domain } from './domain';
import { DomainTag } from './domain_tag';
import { Draft } from './draft';
import { DraftComment } from './draft_comment';
import { EmailAddress } from './email_address';
import { Entity } from '../entity';
import { MerchiFile } from './file';
import { Inventory } from './inventory';
import { Invoice } from './invoice';
import { JobComment } from './job_comment';
import { Notification } from './notification';
import { PhoneNumber } from './phone_number';
import { Product } from './product';
import { Shipment } from './shipment';
import { User } from './user';
import { Variation } from './variation';
import { VariationsGroup } from './variations_group';

export class Job extends Entity {
  protected static resourceName: string = "jobs";
  protected static singularName: string = "job";
  protected static pluralName: string = "jobs";

  @Job.property()
  public archived?: Date | null;

  @Job.property()
  public id?: number;

  @Job.property()
  public quantity?: number;

  @Job.property()
  public notes?: string | null;

  @Job.property()
  public productionNotes?: string | null;

  @Job.property()
  public productionStatus?: number | null;

  @Job.property()
  public designStatus?: number | null;

  @Job.property()
  public needsDrafting?: boolean;

  @Job.property()
  public needsProduction?: boolean;

  @Job.property()
  public needsShipping?: boolean;

  @Job.property()
  public quoteSet?: boolean;

  @Job.property()
  public jobInfoApprovedByClient?: boolean;

  @Job.property()
  public paymentStatus?: number | null;

  @Job.property()
  public deductionDate?: Date | null;

  @Job.property()
  public shippingStatus?: number | null;

  @Job.property()
  public completed?: boolean;

  @Job.property()
  public priority?: number;

  @Job.property()
  public jobWeight?: number | null;

  @Job.property()
  public jobVolume?: number | null;

  @Job.property()
  public received?: Date;

  @Job.property()
  public deadline?: Date;

  @Job.property()
  public updated?: Date;

  @Job.property()
  public automaticPriceEnabled?: boolean;

  @Job.property()
  public costPerUnit?: number | null;

  @Job.property()
  public cost?: number | null;

  @Job.property()
  public taxAmount?: number | null;

  @Job.property({embeddedByDefault: false})
  public canDeduct?: boolean;

  @Job.property({embeddedByDefault: false})
  public unreadNotificationsCount?: number;

  @Job.property({embeddedByDefault: false})
  public unreadJobInfoNotificationsCount?: number;

  @Job.property({embeddedByDefault: false})
  public unreadJobDraftingNotificationsCount?: number;

  @Job.property({embeddedByDefault: false})
  public unreadJobProductionNotificationsCount?: number;

  @Job.property({embeddedByDefault: false})
  public unreadJobShippingNotificationsCount?: number;

  @Job.property({embeddedByDefault: false})
  public unreadJobInvoicingNotificationsCount?: number;

  @Job.property({arrayType: "Draft"})
  public drafts?: Array<Draft>;

  @Job.property({arrayType: "JobComment"})
  public comments?: Array<JobComment>;

  @Job.property()
  public client?: User;

  @Job.property()
  public manager?: User | null;

  @Job.property()
  public designer?: User | null;

  @Job.property()
  public clientCompany?: Company | null;

  @Job.property()
  public clientPhone?: PhoneNumber | null;

  @Job.property()
  public clientEmail?: EmailAddress | null;

  @Job.property()
  public clientCompanyPhone?: PhoneNumber | null;

  @Job.property()
  public clientCompanyEmail?: EmailAddress | null;

  @Job.property()
  public product?: Product;

  @Job.property({arrayType: "DraftComment"})
  public draftComments?: Array<DraftComment>;

  @Job.property()
  public taxType?: CountryTax | null;

  @Job.property({arrayType: "DomainTag"})
  public tags?: Array<DomainTag>;

  @Job.property()
  public shipping?: Address | null;

  @Job.property()
  public productionShippingAddress?: Address | null;

  @Job.property()
  public domain?: Domain;

  @Job.property()
  public invoice?: Invoice | null;

  @Job.property({arrayType: "MerchiFile"})
  public productionFiles?: Array<MerchiFile>;

  @Job.property({arrayType: "MerchiFile"})
  public clientFiles?: Array<MerchiFile>;

  @Job.property()
  public shipment?: Shipment | null;

  @Job.property()
  public inventory?: Inventory | null;

  @Job.property({arrayType: "VariationsGroup"})
  public variationsGroups?: Array<VariationsGroup>;

  @Job.property({arrayType: "Variation"})
  public variations?: Array<Variation>;

  @Job.property({arrayType: "Notification"})
  public notifications?: Array<Notification>;

  @Job.property({arrayType: "Assignment"})
  public assignments?: Array<Assignment>;

  @Job.property()
  public supplyAssignment?: Assignment;

  @Job.property({arrayType: "Inventory",
                 embeddedByDefault: false})
  public matchingInventory?: Inventory | null;
}
