import generateUUID from './uuid.js';
import { fieldTypes } from './field_types.js';
import { addPropertyTo } from './model.js';
import { isUndefined } from './helpers.js';
import { VariationOption } from './variation_option.js';
import { VariationField } from './variation_field.js';
import { MerchiFile } from './merchi_file.js';

export function Variation() {
    this.resource = '/variation';
    this.json = 'variation';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'value');
    addPropertyTo(this, 'quantity');
    addPropertyTo(this, 'cost');
    addPropertyTo(this, 'onceOffCost');
    addPropertyTo(this, 'unitCost');
    addPropertyTo(this, 'unitCostTotal');
    addPropertyTo(this, 'selectableOptions', VariationOption);
    addPropertyTo(this, 'selectedOptions', VariationOption);
    addPropertyTo(this, 'variationField', VariationField);
    addPropertyTo(this, 'variationFiles', MerchiFile);

    this.unitCostAndOnceOffCost = function () {
        var unitCost = this.unitCost() ? this.unitCost() : 0,
            onceOffCost = this.onceOffCost() ? this.onceOffCost() : 0;
        return unitCost + onceOffCost;
    }

    this.unitCostTotalAndOnceOffCost = function () {
        var unitCostTotal = this.unitCostTotal() ? this.unitCostTotal() : 0,
            onceOffCost = this.onceOffCost() ? this.onceOffCost() : 0;
        return unitCostTotal + onceOffCost;
    }

    this.isTextField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isTextType();
    };
    this.isNumberField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isNumberType();
    };

    this.isSelectField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isSelectType();
    };

    this.isCheckBoxField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isCheckboxType();
    };

    this.isRadioField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isRadioType();
    };

    this.isColourSelectField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isColourSelectType();
    };

    this.isImageSelectField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isImageSelectType();
    };

    this.isCheckboxOrRadioField = function () {
        return this.isRadioField() || this.isCheckBoxField();
    };

    this.isSelectableField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isSelectable();
    };

    this.canHaveMultipleSelected = function () {
        var field = this.variationField();
        return Boolean(field) && field.isDefaultMultiSelect();
    };

    this.isTextAreaField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isTextAreaType();
    };

    this.isInstructionsField = function () {
        var field = this.variationField();
        return Boolean(field) && field.isInstructionsType();
    };

    this.isFileUpload = function () {
        var field = this.variationField();
        return Boolean(field) && field.isFileInput();
    };

     this.valueArray = function (updateValueArray) {
        var valuesArray = [], i;
        if (!isUndefined(updateValueArray)) {
            this.value(updateValueArray.join(','));
            return updateValueArray;
         }
        if (this.value() === "") {
            return [];
        }
        valuesArray = String(this.value()).split(',');
        for (i = 0; i < valuesArray.length; i++) {
            valuesArray[i] = parseInt(valuesArray[i], 10);
        }
        return valuesArray;
    };

    this.textValue = function () {
        var field = this.variationField(),
            text = "", i;
        if (field) {
            if (this.isTextField() || this.isNumberField() ||
                this.isTextAreaField()) {
                return this.value();
            }
            if (this.isSelectableField() && this.selectedOptions()) {
                for (i = 0; i < this.selectedOptions().length; i++) {
                    text += this.selectedOptions()[i].value() + " ";
                }
                return text;
            }
        }
        return null;
    };
    this.optionIsSelected = function(id) {
        const selectedIds = this.valueArray();
        return -1 < selectedIds.findIndex(
            (_id) => String(_id) === String(id));
    };

    this.selectedSelectableOptions = function () {
        var self = this,
            options = this.selectableOptions() ?
              this.selectableOptions() : [];
        return options.filter((o) =>
            self.optionIsSelected(o.optionId()));
    };

    this.selectedFieldOptions = function () {
        var field = this.variationField(),
            options = field.options() ? field.options() : [],
            valueArray = this.valueArray(),
            optionsArray = [], selectedId, option, i, z;
        for (i = 0; i < valueArray.length; i++) {
            selectedId = valueArray[i];
            for (z = 0; z < options.length; z++) {
                option = options[z];
                if (selectedId === option.id()) {
                    optionsArray.push(option);
                }
            }
        }
        return optionsArray;
    };

    this.findOptionValueIndex = function (optionId) {
        return this.valueArray().indexOf(parseInt(optionId, 10));
    };

    this.optionIsChecked = function (optionId) {
        return this.findOptionValueIndex(optionId) > -1;
    };

    this.addOptionToValueArray = function (optionId) {
        var newValueArray = this.valueArray();
        if (!this.optionIsChecked(optionId)) {
            newValueArray.push(optionId);
            this.valueArray(newValueArray);
        }
    };

    this.removeOptionFromValueArray = function (optionId) {
        var index = this.findOptionValueIndex(optionId),
            newValueArray = this.valueArray();
        newValueArray.splice(index, 1);
        this.valueArray(newValueArray);
    };

    this.fieldName = function () {
        return this.variationField().name();
    };

    this.fieldType = function () {
        return this.variationField().fieldType();
    };

    this.hasOptions = function () {
        return Boolean(this.selectedOptions());
    };
    this.hasMultipleOptions = function () {
        return parseInt(this.fieldType(), 10) ===
            fieldTypes.get("CHECKBOX");
    };

    this.isFileUpload = function () {
        return parseInt(this.fieldType(), 10) ===
            fieldTypes.get("FILE_UPLOAD");
    };

    this.isColourPicker = function () {
        return parseInt(this.fieldType(), 10) ===
            fieldTypes.get("COLOUR_PICKER");
    };

    this.clone = function () {
        var cloneVariation = new Variation();
        cloneVariation.value(this.value());
        cloneVariation.cost(this.cost());
        cloneVariation.variationField(this.variationField());
        cloneVariation.variationFiles(this.variationFiles());
        return cloneVariation;
    };

    this.valueIdArray = function () {
        var value = this.value();
        return value ? value.split(',') : [];
    }
    this.concatinatedSelectedOptionValues = function () {
        var optionIds = this.valueIdArray(),
            optionIdsLength = optionIds.length - 1,
            field = this.variationField(),
            value = '',
            option,
            i;
        for (i = 0; i < optionIds.length; i++) {
            option = field.findOptionById(optionIds[i]);
            value += option.value();
            if (optionIdsLength > i) {
                value += ', ';
            }
        }
        return value;
    }

    this.valueString = function () {
        var field = this.variationField();
        if (field.isSelectable()) {
            return this.concatinatedSelectedOptionValues();
        } else if (this.isFileUpload() && this.variationFiles()) {
            if (this.variationFiles().length > 1) {
                return 'uploaded files';
            }
            return 'uploaded file';
        }
        return this.value();
    };

}
