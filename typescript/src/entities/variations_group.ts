import { CartItem } from './cart_item';
import { Entity } from '../entity';
import { Job } from './job';
import { Variation } from './variation';
import { MatchingInventory } from './matching_inventory';

export class VariationsGroup extends Entity {
  protected static resourceName = 'variations_groups';
  protected static singularName = 'variationsGroup';
  protected static pluralName = 'variationsGroups';

  @VariationsGroup.property({type: Date})
  public archived?: Date | null;

  @VariationsGroup.property()
  public id?: number;

  @VariationsGroup.property()
  public quantity?: number;

  @VariationsGroup.property({type: Number})
  public groupCost?: number | null;

  @VariationsGroup.property({type: Job})
  public job?: Job | null;

  @VariationsGroup.property({type: CartItem})
  public cartItem?: CartItem | null;

  @VariationsGroup.property({type: MatchingInventory})
  public matchingInventory?: MatchingInventory | null;

  @VariationsGroup.property({arrayType: 'Variation'})
  public variations?: Variation[];

  @VariationsGroup.property({embeddedByDefault: false})
  public inventoryCount?: number;

  @VariationsGroup.property({embeddedByDefault: false})
  public inventorySufficient?: boolean;
}
