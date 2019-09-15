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

  @Job.property("archived")
  public archived?: Date | null;

  @Job.property("id")
  public id?: number;

  @Job.property("quantity")
  public quantity?: number;

  @Job.property("notes")
  public notes?: string | null;

  @Job.property("productionNotes")
  public productionNotes?: string | null;

  @Job.property("productionStatus")
  public productionStatus?: number | null;

  @Job.property("designStatus")
  public designStatus?: number | null;

  @Job.property("needsDrafting")
  public needsDrafting?: boolean;

  @Job.property("needsProduction")
  public needsProduction?: boolean;

  @Job.property("needsShipping")
  public needsShipping?: boolean;

  @Job.property("quoteSet")
  public quoteSet?: boolean;

  @Job.property("jobInfoApprovedByClient")
  public jobInfoApprovedByClient?: boolean;

  @Job.property("paymentStatus")
  public paymentStatus?: number | null;

  @Job.property("deductionDate")
  public deductionDate?: Date | null;

  @Job.property("shippingStatus")
  public shippingStatus?: number | null;

  @Job.property("completed")
  public completed?: boolean;

  @Job.property("priority")
  public priority?: number;

  @Job.property("jobWeight")
  public jobWeight?: number | null;

  @Job.property("jobVolume")
  public jobVolume?: number | null;

  @Job.property("received")
  public received?: Date;

  @Job.property("deadline")
  public deadline?: Date;

  @Job.property("updated")
  public updated?: Date;

  @Job.property("automaticPriceEnabled")
  public automaticPriceEnabled?: boolean;

  @Job.property("costPerUnit")
  public costPerUnit?: number | null;

  @Job.property("cost")
  public cost?: number | null;

  @Job.property("taxAmount")
  public taxAmount?: number | null;

  @Job.property("canDeduct", undefined, {embeddedByDefault: false})
  public canDeduct?: boolean;

  @Job.property("unreadNotificationsCount", undefined,
                {embeddedByDefault: false})
  public unreadNotificationsCount?: number;

  @Job.property("unreadJobInfoNotificationsCount", undefined,
                {embeddedByDefault: false})
  public unreadJobInfoNotificationsCount?: number;

  @Job.property("unreadJobDraftingNotificationsCount", undefined,
                {embeddedByDefault: false})
  public unreadJobDraftingNotificationsCount?: number;

  @Job.property("unreadJobProductionNotificationsCount", undefined,
                {embeddedByDefault: false})
  public unreadJobProductionNotificationsCount?: number;

  @Job.property("unreadJobShippingNotificationsCount", undefined,
                {embeddedByDefault: false})
  public unreadJobShippingNotificationsCount?: number;

  @Job.property("unreadJobInvoicingNotificationsCount", undefined,
                {embeddedByDefault: false})
  public unreadJobInvoicingNotificationsCount?: number;

  @Job.property("drafts", "Draft")
  public drafts?: Array<Draft>;

  @Job.property("comments", "JobComment")
  public comments?: Array<JobComment>;

  @Job.property("client")
  public client?: User;

  @Job.property("manager")
  public manager?: User | null;

  @Job.property("designer")
  public designer?: User | null;

  @Job.property("clientCompany")
  public clientCompany?: Company | null;

  @Job.property("clientPhone")
  public clientPhone?: PhoneNumber | null;

  @Job.property("clientEmail")
  public clientEmail?: EmailAddress | null;

  @Job.property("clientCompanyPhone")
  public clientCompanyPhone?: PhoneNumber | null;

  @Job.property("clientCompanyEmail")
  public clientCompanyEmail?: EmailAddress | null;

  @Job.property("product")
  public product?: Product;

  @Job.property("draftComments", "DraftComment")
  public draftComments?: Array<DraftComment>;

  @Job.property("taxType")
  public taxType?: CountryTax | null;

  @Job.property("tags", "DomainTag")
  public tags?: Array<DomainTag>;

  @Job.property("shipping")
  public shipping?: Address | null;

  @Job.property("productionShippingAddress")
  public productionShippingAddress?: Address | null;

  @Job.property("domain")
  public domain?: Domain;

  @Job.property("invoice")
  public invoice?: Invoice | null;

  @Job.property("productionFiles", "MerchiFile")
  public productionFiles?: Array<MerchiFile>;

  @Job.property("clientFiles", "MerchiFile")
  public clientFiles?: Array<MerchiFile>;

  @Job.property("shipment")
  public shipment?: Shipment | null;

  @Job.property("inventory")
  public inventory?: Inventory | null;

  @Job.property("variationsGroups", "VariationsGroup")
  public variationsGroups?: Array<VariationsGroup>;

  @Job.property("variations", "Variation")
  public variations?: Array<Variation>;

  @Job.property("notifications", "Notification")
  public notifications?: Array<Notification>;

  @Job.property("assignments", "Assignment")
  public assignments?: Array<Assignment>;

  @Job.property("supplyAssignment")
  public supplyAssignment?: Assignment;

  @Job.property("matchingInventory", "Inventory", {embeddedByDefault: false})
  public matchingInventory?: Inventory | null;
}
