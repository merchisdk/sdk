import { CartItem } from './cart_item';
import { Entity } from '../entity';
import { Inventory } from './inventory';
import { Job } from './job';
import { Variation } from './variation';

export class VariationsGroup extends Entity {
  protected static resourceName: string = 'variations_groups';
  protected static singularName: string = 'variationsGroup';
  protected static pluralName: string = 'variationsGroups';

  @VariationsGroup.property()
  public archived?: Date | null;

  @VariationsGroup.property()
  public id?: number;

  @VariationsGroup.property()
  public quantity?: number;

  @VariationsGroup.property()
  public groupCost?: number | null;

  @VariationsGroup.property()
  public job?: Job | null;

  @VariationsGroup.property()
  public cartItem?: CartItem | null;

  @VariationsGroup.property()
  public inventory?: Inventory | null;

  @VariationsGroup.property({ arrayType: 'Variation' })
  public variations?: Array<Variation>;
}
