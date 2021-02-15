import { Domain } from './domain';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { Job } from './job';
import { Product } from './product';
import { Shipment } from './shipment';

export class DomainTag extends Entity {
  protected static resourceName: string = 'domain_tags';
  protected static singularName: string = 'domainTag';
  protected static pluralName: string = 'domainTags';

  @DomainTag.property()
  public id?: number;

  @DomainTag.property()
  public colour?: number;

  @DomainTag.property()
  public name?: string;

  @DomainTag.property()
  public description?: string;

  @DomainTag.property()
  public domain?: Domain;

  @DomainTag.property({arrayType: 'Job'})
  public jobs?: Job[];

  @DomainTag.property({arrayType: 'Product'})
  public products?: Product[];

  @DomainTag.property({arrayType: 'Invoice'})
  public invoices?: Invoice[];

  @DomainTag.property({arrayType: 'Shipment'})
  public shipments?: Shipment[];
}
