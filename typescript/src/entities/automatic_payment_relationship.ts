import { Company } from './company';
import { Entity } from '../entity';

export class AutomaticPaymentRelationship extends Entity {
  protected static resourceName = 'automatic_payment_relationships';
  protected static singularName = 'automaticPaymentRelationship';
  protected static pluralName = 'automaticPaymentRelationships';

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
