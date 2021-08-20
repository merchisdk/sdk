import { addPropertyTo } from './model';
import { VariationFieldsOption } from './variation_fields_option';

export function InventoryUnitVariation() {
    this.resource = '/inventory_unit_variations';
    this.json = 'inventoryUnitVariation';

    addPropertyTo(this, 'variationFieldsOption',
                  VariationFieldsOption);

    this.optionId = function () {
        return this.variationFieldsOption().id();
    };
}
