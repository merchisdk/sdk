import { Address } from './address';
import { Assignment } from './assignment';
import { Company } from './company';
import { CountryTax } from './country_tax';
import { DomainTag } from './domain_tag';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { Job } from './job';
import { User } from './user';

export class Shipment extends Entity {
  protected static resourceName: string = "shipments";
  protected static singularName: string = "shipment";
  protected static pluralName: string = "shipments";

  @Shipment.property()
  public archived?: Date | null;

  @Shipment.property()
  public id?: number;

  @Shipment.property()
  public creationDate?: Date | null;

  @Shipment.property()
  public dispatchedDate?: Date | null;

  @Shipment.property()
  public dispatchDate?: Date | null;

  @Shipment.property()
  public expectedReceiveDate?: Date | null;

  @Shipment.property()
  public receivedDate?: Date | null;

  @Shipment.property()
  public senderResponsible?: boolean;

  @Shipment.property()
  public senderNotes?: string | null;

  @Shipment.property()
  public receiverNotes?: string | null;

  @Shipment.property()
  public transportCompany?: number | null;

  @Shipment.property()
  public trackingNumber?: string | null;

  @Shipment.property()
  public cost?: number | null;

  @Shipment.property()
  public taxAmount?: number | null;

  @Shipment.property()
  public maxWeight?: number | null;

  @Shipment.property()
  public maxVolume?: number | null;

  @Shipment.property()
  public sendSms?: boolean;

  @Shipment.property()
  public sendEmail?: boolean;

  @Shipment.property()
  public taxType?: CountryTax | null;

  @Shipment.property()
  public sender?: User | null;

  @Shipment.property()
  public senderCompany?: Company | null;

  @Shipment.property()
  public senderAddress?: Address | null;

  @Shipment.property()
  public receiver?: User | null;

  @Shipment.property()
  public receiverCompany?: Company | null;

  @Shipment.property()
  public receiverAddress?: Address | null;

  @Shipment.property()
  public invoice?: Invoice | null;

  @Shipment.property({arrayType: "DomainTag"})
  public tags?: Array<DomainTag>;

  @Shipment.property({arrayType: "Assignment"})
  public assignments?: Array<Assignment>;

  @Shipment.property({arrayType: "Job"})
  public jobs?: Array<Job>;
}
