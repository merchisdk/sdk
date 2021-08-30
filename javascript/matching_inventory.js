import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { Inventory } from './inventory';
import { Job } from './job';
import { VariationsGroup } from './variations_group';

export function MatchingInventory() {
    this.resource = '/matching_inventories';
    this.json = 'matching_inventory';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'deductionDate');
    addPropertyTo(this, 'canDeduct');
    addPropertyTo(this, 'inventory', Inventory);
    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'group', VariationsGroup);
}
