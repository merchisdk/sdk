import { Domain } from './domain';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { Job } from './job';
import { Product } from './product';
import { Shipment } from './shipment';

export class DomainTag extends Entity {
  protected static resourceName: string = "domain_tags";
  protected static singularName: string = "domainTag";
  protected static pluralName: string = "domainTags";

  @DomainTag.property("id")
  public id?: number;

  @DomainTag.property("colour")
  public colour?: number;

  @DomainTag.property("name")
  public name?: string;

  @DomainTag.property("description")
  public description?: string;

  @DomainTag.property("domain")
  public domain?: Domain;

  @DomainTag.property("jobs", "Job")
  public jobs?: Array<Job>;

  @DomainTag.property("products", "Product")
  public products?: Array<Product>;

  @DomainTag.property("invoices", "Invoice")
  public invoices?: Array<Invoice>;

  @DomainTag.property("shipments", "Shipment")
  public shipments?: Array<Shipment>;
}
