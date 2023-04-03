import { Entity } from '../entity';
import { Company } from './company';

export class PaymentDevice extends Entity {
  protected static resourceName = 'payment_devices';
  protected static singularName = 'paymentDevice';
  protected static pluralName = 'paymentDevices';

  @PaymentDevice.property({type: Date})
  public archived?: Date | null;

  @PaymentDevice.property()
  public id?: number;

  @PaymentDevice.property({type: String})
  public code?: string;

  @PaymentDevice.property({type: String})
  public deviceId?: string;

  @PaymentDevice.property({type: String})
  public squareId?: string;

  @PaymentDevice.property({type: String})
  public deviceData?: string;

  @PaymentDevice.property({type: Company})
  public company?: Company | null;

}
