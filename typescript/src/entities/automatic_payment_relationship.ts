import { Company } from './company';
import { Entity } from '../entity';

export class AutomaticPaymentRelationship extends Entity {
  protected static resourceName: string = 'automatic_payment_relationships';
  protected static singularName: string = 'AutomaticPaymentRelationship';
  protected static pluralName: string = 'AutomaticPaymentRelationships';

  @AutomaticPaymentRelationship.property({type: Date})
  public archived?: Date | null;

  @AutomaticPaymentRelationship.property()
  public id?: number;

  @AutomaticPaymentRelationship.property()
  public creationDate?: Date;

  @AutomaticPaymentRelationship.property({type: Company})
  public companyCustomer?: Company;

  @AutomaticPaymentRelationship.property({type: Company})
  public companySupplier?: Company;

  @AutomaticPaymentRelationship.property({type: String})
  public stripeCustomerId?: string;
}
