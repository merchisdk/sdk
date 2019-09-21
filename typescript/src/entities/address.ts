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

  @Address.property({arrayType: "Shipment"})
  public shipmentAsSenderAddress?: Array<Shipment>;

  @Address.property({arrayType: "Shipment"})
  public shipmentsAsReceiverAddress?: Array<Shipment>;

  @Address.property({arrayType: "Bank"})
  public banks?: Array<Bank>;

  @Address.property({arrayType: "User"})
  public users?: Array<User>;

  @Address.property({arrayType: "Inventory"})
  public inventories?: Array<Inventory>;

  @Address.property({arrayType: "Job"})
  public jobs?: Array<Job>;

  @Address.property({arrayType: "Job"})
  public productedJobs?: Array<Job>;

  @Address.property({arrayType: "Invoice"})
  public shippingTo?: Array<Invoice>;

  @Address.property({arrayType: "Company"})
  public companies?: Array<Company>;
}
