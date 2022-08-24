import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { MerchiFile } from './merchi_file';
import { Variation } from './variation';

export function VariationOption() {
    this.json = 'variation_option';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'optionId');
    addPropertyTo(this, 'value');
    addPropertyTo(this, 'available');
    addPropertyTo(this, 'position');
    addPropertyTo(this, 'default');
    addPropertyTo(this, 'include');
    addPropertyTo(this, 'colour');
    addPropertyTo(this, 'quantity');
    addPropertyTo(this, 'onceOffCost');
    addPropertyTo(this, 'unitCost');
    addPropertyTo(this, 'unitCostTotal');
    addPropertyTo(this, 'totalCost');
    addPropertyTo(this, 'fieldName');
    addPropertyTo(this, 'linkedFile', MerchiFile);

    this.copyFieldOption = function (option) {
        this.optionId(option.id());
        this.value(option.value());
        this.colour(option.colour());
        this.position(option.position());
        this.default(option.default());
        this.onceOffCost(option.variationCost());
        this.unitCost(option.variationUnitCost());
        this.linkedFile(option.linkedFile());
    }

    // a hack around function for job cloneable renderering
    this.covertToVariation = function () {
        var variationConverted = new Variation(),
            unitCost = this.unitCost(),
            fieldName = this.fieldName(),
            optionValue = this.value();
        variationConverted.value(this.optionId());
        variationConverted.quantity(this.quantity());
        variationConverted.onceOffCost(this.onceOffCost());
        variationConverted.unitCostTotal(this.unitCostTotal());

        // hack around for variation unit cost
        variationConverted.unitCost = function () {
            return unitCost;
        };
        variationConverted.valueString = function () {
            return optionValue;
        };
        variationConverted.fieldName = function () {
            return fieldName;
        };
        return variationConverted;
    };
}
