import { CartItem } from './cart_item';
import { Entity } from '../entity';
import { Inventory } from './inventory';
import { Job } from './job';
import { Variation } from './variation';

export class VariationsGroup extends Entity {
  protected static resourceName: string = "variations_groups";
  protected static singularName: string = "variationsGroup";
  protected static pluralName: string = "variationsGroups";

  @VariationsGroup.property("archived")
  public archived?: Date | null;

  @VariationsGroup.property("id")
  public id?: number;

  @VariationsGroup.property("quantity")
  public quantity?: number;

  @VariationsGroup.property("groupCost")
  public groupCost?: number | null;

  @VariationsGroup.property("job")
  public job?: Job | null;

  @VariationsGroup.property("cartItem")
  public cartItem?: CartItem | null;

  @VariationsGroup.property("inventory")
  public inventory?: Inventory | null;

  @VariationsGroup.property("variations", "Variation")
  public variations?: Array<Variation>;
}
