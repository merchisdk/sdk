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

  @Shipment.property("archived")
  public archived?: Date | null;

  @Shipment.property("id")
  public id?: number;

  @Shipment.property("creationDate")
  public creationDate?: Date | null;

  @Shipment.property("dispatchedDate")
  public dispatchedDate?: Date | null;

  @Shipment.property("dispatchDate")
  public dispatchDate?: Date | null;

  @Shipment.property("expectedReceiveDate")
  public expectedReceiveDate?: Date | null;

  @Shipment.property("receivedDate")
  public receivedDate?: Date | null;

  @Shipment.property("senderResponsible")
  public senderResponsible?: boolean;

  @Shipment.property("senderNotes")
  public senderNotes?: string | null;

  @Shipment.property("receiverNotes")
  public receiverNotes?: string | null;

  @Shipment.property("transportCompany")
  public transportCompany?: number | null;

  @Shipment.property("trackingNumber")
  public trackingNumber?: string | null;

  @Shipment.property("cost")
  public cost?: number | null;

  @Shipment.property("taxAmount")
  public taxAmount?: number | null;

  @Shipment.property("maxWeight")
  public maxWeight?: number | null;

  @Shipment.property("maxVolume")
  public maxVolume?: number | null;

  @Shipment.property("sendSms")
  public sendSms?: boolean;

  @Shipment.property("sendEmail")
  public sendEmail?: boolean;

  @Shipment.property("taxType")
  public taxType?: CountryTax | null;

  @Shipment.property("sender")
  public sender?: User | null;

  @Shipment.property("senderCompany")
  public senderCompany?: Company | null;

  @Shipment.property("senderAddress")
  public senderAddress?: Address | null;

  @Shipment.property("receiver")
  public receiver?: User | null;

  @Shipment.property("receiverCompany")
  public receiverCompany?: Company | null;

  @Shipment.property("receiverAddress")
  public receiverAddress?: Address | null;

  @Shipment.property("invoice")
  public invoice?: Invoice | null;

  @Shipment.property("tags", "DomainTag")
  public tags?: Array<DomainTag>;

  @Shipment.property("assignments", "Assignment")
  public assignments?: Array<Assignment>;

  @Shipment.property("jobs", "Job")
  public jobs?: Array<Job>;
}
