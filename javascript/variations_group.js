import { generateUUID } from './uuid';
import { addPropertyTo } from './model';
import { Variation } from './variation';

export function VariationsGroup() {
    this.resource = '/variationsGroups';
    this.json = 'variationsGroup';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'quantity');
    addPropertyTo(this, 'groupCost');
    addPropertyTo(this, 'variations', Variation);

    this.clone = function () {
        var groupClone = new VariationsGroup(),
            variationsClone = [], i;
        groupClone.groupCost(this.groupCost());
        groupClone.quantity(this.quantity());
        for (i = 0; i < this.variations().length; i++) {
            variationsClone.push(this.variations()[i].clone());
        }
        return groupClone.variations(variationsClone);
    };

    this.loopVariationsAndReturnAttributeTotal = function (attribute) {
        var variations = this.variations() ?
                this.variations() : [],
            total = 0,
            i;
        for (i = 0; i < variations.length; i++) {
            total += variations[i][attribute]();
        }
        return parseFloat(total).toFixed(2);
    };

    this.variationsUnitCostAndOnceOffCost = function () {
        return this.loopVariationsAndReturnAttributeTotal(
            'unitCostAndOnceOffCost');
    };
}
