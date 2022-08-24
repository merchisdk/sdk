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
import { MatchingInventory } from './matching_inventory';
import { Invoice } from './invoice';
import { JobComment } from './job_comment';
import { Notification } from './notification';
import { PhoneNumber } from './phone_number';
import { Product } from './product';
import { RequestOptions } from '../request';
import { Shipment } from './shipment';
import { User } from './user';
import { Variation } from './variation';
import { VariationsGroup } from './variations_group';
import { InventoryStatus } from '../constants/inventory_statuses';


export class Job extends Entity {
  protected static resourceName: string = 'jobs';
  protected static singularName: string = 'job';
  protected static pluralName: string = 'jobs';

  @Job.property({type: Date})
  public archived?: Date | null;

  @Job.property()
  public id?: number;

  @Job.property()
  public quantity?: number;

  @Job.property()
  public currency?: string;

  @Job.property({type: String})
  public notes?: string | null;

  @Job.property({type: String})
  public productionNotes?: string | null;

  @Job.property()
  public shopifyOrderId?: string;

  @Job.property({type: Number})
  public productionStatus?: number | null;

  @Job.property({type: Number})
  public designStatus?: number | null;

  @Job.property()
  public needsDrafting?: boolean;

  @Job.property()
  public needsGroupBuy?: boolean;

  @Job.property()
  public needsProduction?: boolean;

  @Job.property()
  public needsShipping?: boolean;

  @Job.property()
  public needsInvoicing?: boolean;

  @Job.property()
  public needsInventory?: boolean;

  @Job.property()
  public allowClientDraftContribution?: boolean;

  @Job.property()
  public quoteSet?: boolean;

  @Job.property()
  public jobInfoApprovedByClient?: boolean;

  @Job.property({type: Number})
  public groupBuyStatus?: number | null;

  @Job.property({type: Number})
  public paymentStatus?: number | null;

  @Job.property({type: Date})
  public deductionDate?: Date | null;

  @Job.property({type: Number})
  public shippingStatus?: number | null;

  @Job.property()
  public completed?: boolean;

  @Job.property()
  public callToActions?: string;

  @Job.property()
  public callToActionDetails?: any[];

  @Job.property()
  public priority?: number;

  @Job.property({type: Number})
  public jobWeight?: number | null;

  @Job.property({type: Number})
  public jobVolume?: number | null;

  @Job.property()
  public received?: Date;

  @Job.property()
  public deadline?: Date;

  @Job.property()
  public updated?: Date;

  @Job.property()
  public groupBuyProductionStarted?: Date;

  @Job.property()
  public automaticPriceEnabled?: boolean;

  @Job.property()
  public dropShip?: boolean;

  @Job.property({type: Number})
  public costPerUnit?: number | null;

  @Job.property({type: Number})
  public cost?: number | null;

  @Job.property({type: Number})
  public taxAmount?: number | null;

  @Job.property({type: Number})
  public totalCost?: number | null;

  @Job.property({embeddedByDefault: false})
  public inventoriesStatus?: InventoryStatus;

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

  @Job.property({embeddedByDefault: false})
  public limitedStock?: boolean;

  @Job.property({embeddedByDefault: false})
  public inventoryCount?: number;

  @Job.property({embeddedByDefault: false})
  public inventorySufficient?: boolean;

  @Job.property({arrayType: 'Draft'})
  public drafts?: Draft[];

  @Job.property({arrayType: 'Draft'})
  public sharedDrafts?: Draft[];

  @Job.property({arrayType: 'Draft'})
  public ownDrafts?: Draft[];

  @Job.property({arrayType: 'JobComment'})
  public comments?: JobComment[];

  @Job.property()
  public client?: User;

  @Job.property({type: User})
  public manager?: User | null;

  @Job.property({type: User})
  public designer?: User | null;

  @Job.property({type: Company})
  public clientCompany?: Company | null;

  @Job.property({type: PhoneNumber})
  public clientPhone?: PhoneNumber | null;

  @Job.property({type: EmailAddress})
  public clientEmail?: EmailAddress | null;

  @Job.property({type: PhoneNumber})
  public clientCompanyPhone?: PhoneNumber | null;

  @Job.property({type: EmailAddress})
  public clientCompanyEmail?: EmailAddress | null;

  @Job.property()
  public product?: Product;

  @Job.property({arrayType: 'DraftComment'})
  public draftComments?: DraftComment[];

  @Job.property()
  public preDraftCommentsCount?: number;

  @Job.property({type: CountryTax})
  public taxType?: CountryTax | null;

  @Job.property({arrayType: 'DomainTag'})
  public tags?: DomainTag[];

  @Job.property({arrayType: 'Product'})
  public createdProducts?: Product[];

  @Job.property({type: Address})
  public shipping?: Address | null;

  @Job.property({type: Address})
  public productionShippingAddress?: Address | null;

  @Job.property()
  public domain?: Domain;

  @Job.property({type: Invoice})
  public invoice?: Invoice | null;

  @Job.property({arrayType: 'MerchiFile'})
  public productionFiles?: MerchiFile[];

  @Job.property({arrayType: 'MerchiFile'})
  public clientFiles?: MerchiFile[];

  @Job.property({type: Shipment})
  public shipment?: Shipment | null;

  @Job.property({arrayType: 'MatchingInventory'})
  public matchingInventories?: MatchingInventory[];

  @Job.property({arrayType: 'VariationsGroup'})
  public variationsGroups?: VariationsGroup[];

  @Job.property({arrayType: 'Variation'})
  public variations?: Variation[];

  @Job.property({arrayType: 'Notification'})
  public notifications?: Notification[];

  @Job.property({arrayType: 'Assignment'})
  public assignments?: Assignment[];

  @Job.property()
  public supplyAssignment?: Assignment;

  @Job.property()
  public supplyJob?: Job;

  public getQuote = () => {
    const resource = '/specialised-order-estimate/';
    const data = this.toFormData({excludeOld: false});
    const fetchOptions: RequestOptions = {method: 'POST', body: data};
    fetchOptions.query = [];
    fetchOptions.query.push(['skip_rights', 'y']);

    return this.merchi.authenticatedFetch(resource, fetchOptions).
      then((data: any) => { this.fromJson(data, {makeDirty: true});
        return this;});
  }

  public deduct = (matchingInventories: MatchingInventory[]) => {
    const resource = `/jobs/${this.id}/deduct/`;
    const jobForPayload = new this.merchi.Job();
    jobForPayload.matchingInventories = matchingInventories;
    jobForPayload.id = 1;
    const data = jobForPayload.toFormData({excludeOld: false});
    const embed = {matchingInventories: {inventory: {}, group: {}}};
    const fetchOptions: RequestOptions = {
      method: 'POST', body: data, query: [['embed', JSON.stringify(embed)]]};

    return this.merchi.authenticatedFetch(resource, fetchOptions).
      then((data: any) => {
        this.fromJson(data);
        return this;});
  }

  public bulkDeduct = () => {
    if (this.matchingInventories === undefined) {
      const err = 'matchingInventories is undefined, did you forget to embed' +
        ' it?';
      throw new Error(err);
    }
    return this.deduct(this.matchingInventories);
  }
}
