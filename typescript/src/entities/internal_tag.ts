import { Company } from './company';
import { Domain } from './domain';
import { Entity } from '../entity';
import { Invoice } from './invoice';
import { Job } from './job';
import { Product } from './product';
import { Shipment } from './shipment';
import { Theme } from './theme';
import { User } from './user';

export class InternalTag extends Entity {
  protected static resourceName = 'internal_tags';
  protected static singularName = 'internalTag';
  protected static pluralName = 'internalTags';

  @InternalTag.property()
  public id?: number;

  @InternalTag.property()
  public colour?: number;

  @InternalTag.property()
  public name?: string;

  @InternalTag.property()
  public description?: string;

  @InternalTag.property({arrayType: 'Company'})
  public companies?: Company[];

  @InternalTag.property({arrayType: 'Domain'})
  public domains?: Domain[];

  @InternalTag.property({arrayType: 'Job'})
  public jobs?: Job[];

  @InternalTag.property({arrayType: 'Product'})
  public products?: Product[];

  @InternalTag.property({arrayType: 'Invoice'})
  public invoices?: Invoice[];

  @InternalTag.property({arrayType: 'Shipment'})
  public shipments?: Shipment[];

  @InternalTag.property({arrayType: 'Theme'})
  public themes?: Theme[];

  @InternalTag.property({arrayType: 'User'})
  public users?: User[];
}
