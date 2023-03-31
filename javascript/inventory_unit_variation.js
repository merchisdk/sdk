import { addPropertyTo } from './model.js';
import { Inventory } from './inventory.js';
import { VariationFieldsOption } from './variation_fields_option.js';

export function InventoryUnitVariation() {
    this.resource = '/inventory_unit_variations';
    this.json = 'inventoryUnitVariation';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'inventory', Inventory);
    addPropertyTo(
        this, 'variationFieldsOption', VariationFieldsOption
    );

    this.optionId = function () {
        return this.variationFieldsOption().id();
    };
}
