import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { DiscountGroup } from './discount_group';
import { MerchiFile } from './merchi_file';
import { variationField } from './variation_field';

export function VariationFieldsOption() {
    this.resource = '/variationFieldOptions';
    this.json = 'variationFieldOption';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'value');
    addPropertyTo(this, 'position');
    addPropertyTo(this, 'default');
    addPropertyTo(this, 'include');
    addPropertyTo(this, 'colour');
    addPropertyTo(this, 'variationCost');
    addPropertyTo(this, 'variationCostDiscountGroup', DiscountGroup);
    addPropertyTo(this, 'variationUnitCost');
    addPropertyTo(this, 'variationUnitCostDiscountGroup', DiscountGroup);
    addPropertyTo(this, 'linkedFile', MerchiFile);
    addPropertyTo(this, 'variationField', variationField)

    this.totalCost = function (quantity) {
        var total = this.variationCost() ?
            this.variationCost() : 0;
        if (this.variationUnitCost() && quantity) {
            total += (quantity * this.variationUnitCost());
        }
        return total;
    };

    this.onceOffCost = function () {
        return this.variationCost();
    };

    this.unitCost = function () {
        return this.variationUnitCost();
    };
}
