import { Address } from './address';
import { Assignment } from './assignment';
import { Company } from './company';
import { CountryTax } from './country_tax';
import { DomainTag } from './domain_tag';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { Quote } from './quote';
import { Job } from './job';
import { User } from './user';
import { ShipmentMethod } from './shipment_method';

interface CalculateOptions {
  strictEmbed?: boolean;
}

export class Shipment extends Entity {
  protected static resourceName: string = 'shipments';
  protected static singularName: string = 'shipment';
  protected static pluralName: string = 'shipments';

  @Shipment.property({type: Date})
  public archived?: Date | null;

  @Shipment.property()
  public id?: number;

  @Shipment.property({type: Date})
  public creationDate?: Date | null;

  @Shipment.property({type: Date})
  public dispatchedDate?: Date | null;

  @Shipment.property({type: Date})
  public dispatchDate?: Date | null;

  @Shipment.property({type: Date})
  public expectedReceiveDate?: Date | null;

  @Shipment.property({type: Date})
  public receivedDate?: Date | null;

  @Shipment.property()
  public senderResponsible?: boolean;

  @Shipment.property({type: String})
  public senderNotes?: string | null;

  @Shipment.property({type: String})
  public receiverNotes?: string | null;

  @Shipment.property({type: Number})
  public transportCompany?: number | null;

  @Shipment.property({type: String})
  public transportCompanyName?: string | null;

  @Shipment.property({type: String})
  public trackingNumber?: string | null;

  @Shipment.property({type: Number})
  public buyCost?: number | null;

  @Shipment.property({type: String})
  public buyCurrency?: string | null;

  @Shipment.property({type: Number})
  public cost?: number | null;

  @Shipment.property({type: Number})
  public taxAmount?: number | null;

  @Shipment.property({type: Number})
  public maxWeight?: number | null;

  @Shipment.property({type: Number})
  public maxVolume?: number | null;

  @Shipment.property()
  public sendSms?: boolean;

  @Shipment.property()
  public sendEmail?: boolean;

  @Shipment.property({type: CountryTax})
  public taxType?: CountryTax | null;

  @Shipment.property()
  public isOnBehalfOf?: boolean;

  @Shipment.property({type: User})
  public onBehalfOf?: User | null;

  @Shipment.property({type: Company})
  public onBehalfOfCompany?: Company | null;

  @Shipment.property({type: User})
  public sender?: User | null;

  @Shipment.property({type: Company})
  public senderCompany?: Company | null;

  @Shipment.property({type: Address})
  public senderAddress?: Address | null;

  @Shipment.property({type: String})
  public blindShipTo?: string | null;

  @Shipment.property({type: User})
  public receiver?: User | null;

  @Shipment.property({type: Company})
  public receiverCompany?: Company | null;

  @Shipment.property({type: Address})
  public receiverAddress?: Address | null;

  @Shipment.property({arrayType: 'Invoice'})
  public invoices?: Invoice[];

  @Shipment.property({type: Quote})
  public quote?: Quote | null;

  @Shipment.property({type: ShipmentMethod})
  public shipmentMethod?: ShipmentMethod | null;

  @Shipment.property({arrayType: 'DomainTag'})
  public tags?: DomainTag[];

  @Shipment.property({arrayType: 'Assignment'})
  public assignments?: Assignment[];

  @Shipment.property({arrayType: 'Job'})
  public jobs?: Job[];

  public calculateSubTotal = (options?: CalculateOptions) => {
    const { strictEmbed = true } = options ? options : {};
    if (strictEmbed){
      if (this.cost === undefined) {
        throw new Error('cost is undefined, did you forget to embed it?');
      }
    }
    const cost = this.cost ? this.cost : 0;
    return parseFloat(String(cost)).toFixed(3);
  }

  public calculateTaxAmount = (options?: CalculateOptions) => {
    const taxPercent = this.taxType && this.taxType.taxPercent ?
      this.taxType.taxPercent : 0;
    const taxRate = taxPercent ? Number(taxPercent) / 100 : 0;
    return (parseFloat(
      this.calculateSubTotal(options)) * taxRate).toFixed(3);
  }

  public calculateTotal = (options?: CalculateOptions) => {
    return (
      parseFloat(this.calculateSubTotal(options)) +
      parseFloat(this.calculateTaxAmount(options))
    ).toFixed(3);
  }
}
