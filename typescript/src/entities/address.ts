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

  @Address.property()
  public archived?: Date | null;

  @Address.property()
  public id?: number;

  @Address.property()
  public lineOne?: string | null;

  @Address.property()
  public lineTwo?: string | null;

  @Address.property()
  public city?: string | null;

  @Address.property()
  public state?: string | null;

  @Address.property()
  public country?: string | null;

  @Address.property()
  public postcode?: string | null;

  @Address.property("Shipment")
  public shipmentAsSenderAddress?: Array<Shipment>;

  @Address.property("Shipment")
  public shipmentsAsReceiverAddress?: Array<Shipment>;

  @Address.property("Bank")
  public banks?: Array<Bank>;

  @Address.property("User")
  public users?: Array<User>;

  @Address.property("Inventory")
  public inventories?: Array<Inventory>;

  @Address.property("Job")
  public jobs?: Array<Job>;

  @Address.property("Job")
  public productedJobs?: Array<Job>;

  @Address.property("Invoice")
  public shippingTo?: Array<Invoice>;

  @Address.property("Company")
  public companies?: Array<Company>;
}
