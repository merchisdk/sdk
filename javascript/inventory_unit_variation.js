import { addPropertyTo } from './model';
import { Inventory } from './inventory';
import { VariationFieldsOption } from './variation_fields_option';

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
