import generateUUID from './uuid.js';
import { addPropertyTo } from './model.js';
import { Inventory } from './inventory.js';
import { Job } from './job.js';
import { VariationsGroup } from './variations_group.js';

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
