import { Bank } from './bank';
import { Company } from './company';
import { Entity } from '../entity';
import { Inventory } from './inventory';
import { Invoice } from './invoice';
import { Job } from './job';
import { Shipment } from './shipment';
import { User } from './user';

export class Address extends Entity {
  protected static resourceName: string = "addresses";
  protected static singularName: string = "address";
  protected static pluralName: string = "addresses";

  @Address.property("archived")
  public archived?: Date | null;

  @Address.property("id")
  public id?: number;

  @Address.property("lineOne")
  public lineOne?: string | null;

  @Address.property("lineTwo")
  public lineTwo?: string | null;

  @Address.property("city")
  public city?: string | null;

  @Address.property("state")
  public state?: string | null;

  @Address.property("country")
  public country?: string | null;

  @Address.property("postcode")
  public postcode?: string | null;

  @Address.property("shipmentAsSenderAddress", "Shipment")
  public shipmentAsSenderAddress?: Array<Shipment>;

  @Address.property("shipmentsAsReceiverAddress", "Shipment")
  public shipmentsAsReceiverAddress?: Array<Shipment>;

  @Address.property("banks", "Bank")
  public banks?: Array<Bank>;

  @Address.property("users", "User")
  public users?: Array<User>;

  @Address.property("inventories", "Inventory")
  public inventories?: Array<Inventory>;

  @Address.property("jobs", "Job")
  public jobs?: Array<Job>;

  @Address.property("productedJobs", "Job")
  public productedJobs?: Array<Job>;

  @Address.property("shippingTo", "Invoice")
  public shippingTo?: Array<Invoice>;

  @Address.property("companies", "Company")
  public companies?: Array<Company>;
}
