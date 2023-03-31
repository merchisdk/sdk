import { generateUUID } from './uuid.js';
import { fieldTypes } from './field_types.js';
import { addPropertyTo } from './model.js';
import { isUndefinedOrNull, clone } from './helpers.js';
import { DiscountGroup } from './discount_group.js';
import { VariationFieldsOption } from './variation_fields_option.js';
import { Variation } from './variation.js';
import { VariationOption } from './variation_option.js';

export function VariationField() {
    this.resource = '/variationFields';
    this.json = 'variationField';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'fieldType');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'position');
    addPropertyTo(this, 'placeholder');
    addPropertyTo(this, 'defaultValue');
    addPropertyTo(this, 'required');
    addPropertyTo(this, 'independent');
    addPropertyTo(this, 'variationCost');
    addPropertyTo(this, 'variationCostDiscountGroup', DiscountGroup);
    addPropertyTo(this, 'variationUnitCost');
    addPropertyTo(this, 'variationUnitCostDiscountGroup', DiscountGroup);
    addPropertyTo(this, 'options', VariationFieldsOption);
    addPropertyTo(this, 'defaultOptions', VariationFieldsOption);
    addPropertyTo(this, 'multipleSelect');
    addPropertyTo(this, 'rows');
    addPropertyTo(this, 'fieldMin');
    addPropertyTo(this, 'fieldMax');
    addPropertyTo(this, 'showFilePreview');
    addPropertyTo(this, 'allowDecimal');
    addPropertyTo(this, 'allowFileMultiple');
    addPropertyTo(this, 'allowFileJpeg');
    addPropertyTo(this, 'allowFileGif');
    addPropertyTo(this, 'allowFilePdf');
    addPropertyTo(this, 'allowFilePng');
    addPropertyTo(this, 'allowFileAi');
    addPropertyTo(this, 'sellerProductEditable');

    this.isType = function (typeString) {
        return parseInt(this.fieldType(), 10) ===
            fieldTypes.get(typeString);
    };

    this.isTextType = function () {
        return this.isType('TEXT_INPUT');
    };

    this.isNumberType = function () {
       return this.isType('NUMBER_INPUT');
    };

    this.isSelectType = function () {
        return this.isType('SELECT');
    };

    this.isDefaultMultiSelect = function () {
        return this.isType('CHECKBOX') || this.isType('IMAGE_SELECT') &&
            this.multipleSelect();
    };

    this.isCheckboxType = function () {
        return this.isType('CHECKBOX');
    };

    this.isRadioType = function () {
        return this.isType('RADIO');
    };
    this.hasOptions = function () {
        return Boolean(this.options());
    };

    this.isCheckboxOrRadio = function () {
        return this.isCheckboxType() || this.isRadioType();
    };

    this.isTextAreaType = function () {
       return this.isType('TEXT_AREA');
    };

    this.isInstructionsType = function () {
        return this.isType('FIELD_INSTRUCTIONS');
     };

    this.isFileInput = function () {
        return this.isType('FILE_UPLOAD');
    };

    this.isColourPickerType = function () {
        return this.isType('COLOUR_PICKER');
    };

    this.isColourSelectType = function () {
        return this.isType('COLOUR_SELECT');
    };

    this.isImageSelectType = function () {
        return this.isType('IMAGE_SELECT');
    };
   this.isSelectable = function () {
        return this.isSelectType() || this.isCheckboxOrRadio() ||
            this.isImageSelectType() || this.isColourSelectType();
    };

    this.canMultiSelect = function () {
        return this.isImageSelectType() || this.isColourSelectType();
    }

    this.fieldInputTypeAttributeValue = function () {
        var inputType = this.fieldType(),
            inputTypeString = null;
        if (inputType === fieldTypes.get("TEXT_INPUT")) {
            inputTypeString = 'text';
         } else if (inputType === fieldTypes.get('FILE_UPLOAD')) {
            inputTypeString = 'file';
        } else if (inputType === fieldTypes.get('NUMBER_INPUT')) {
            inputTypeString = 'number';
        } else if (inputType === fieldTypes.get('RADIO')) {
            inputTypeString = 'radio';
        } else if (inputType === fieldTypes.get('IMAGE_SELECT')) {
            if (this.multipleSelect()) {
                inputTypeString = 'checkbox';
            } else {
                inputTypeString = 'radio';
            }
        } else if (inputType === fieldTypes.get('CHECKBOX')) {
            inputTypeString = 'checkbox';
        } else if (inputType === fieldTypes.get('COLOUR_PICKER')) {
            inputTypeString = 'color';
        }
        return inputTypeString;
    };

    this.hasMultipleDefaults = function () {
        return this.optionsDefaults().length > 1;
    };

    this.setSingleOptionDefault = function (index) {
        var i, options = this.options();
        for (i = 0; i < options.length; i++) {
            options[i].default(false);
        }
        options[index].default(true);
    }

    this.optionsDefaults = function () {
        var i, defaultsArray = [],
            options = this.options();
        for (i = 0; i < options.length; i++) {
            if (options[i].default()) {
                defaultsArray.push(options[i]);
            }
        }
         return defaultsArray;
    };

    this.findOptionById = function (id) {
        var i = 0, options;
        options = this.options();
        for (i = 0; i < options.length; i++) {
            if (parseInt(options[i].id(), 10) === parseInt(id, 10)) {
                return options[i];
            }
        }
      return null;
    };


    this.allowFileJpegString = function () {
        return Boolean(this.allowFileJpeg()) ? ".jpeg, .jpg" : "";
    };

    this.allowFileGifString = function () {
        return Boolean(this.allowFileGif()) ? ".gif" : "";
    };

    this.allowFilePdfString = function () {
        return Boolean(this.allowFilePdf()) ? ".pdf" : "";
    };

    this.allowFilePngString = function () {
        return Boolean(this.allowFilePng()) ? ".png" : "";
    };

    this.allowFileAiString = function () {
        return Boolean(this.allowFileAi()) ? ".ai" : "";
    };

    this.allowedFileTypesString = function () {
        function appendType(fileTypeString) {
            if (fileTypeString !== "") {
                return fileTypeString + ", ";
            }
            return "";
        }
        return appendType(this.allowFileJpegString()) +
            appendType(this.allowFileGifString()) +
            appendType(this.allowFilePdfString()) +
            appendType(this.allowFilePngString()) +
            appendType(this.allowFileAiString());
    };
   this.allowFileMultipleString = function () {
        if (this.allowFileMultiple()) {
            return "multiple";
        }
        return "";
    };
   this.buildEmptyVariation = function () {
        var variationBuilt = new Variation(),
            value, options, i,
            onceOffCost = 0,
            selectableOptions = [],
            sellerProductEditable = this.sellerProductEditable();
        if (this.isSelectable()) {
            options = this.options();
            value = [];
            for (i = 0; i < options.length; i++) {
                const selectableOption = new VariationOption();
                selectableOption.copyFieldOption(options[i]);
                selectableOptions.push(selectableOption);
                if ((!sellerProductEditable && options[i].default()) ||
                    (sellerProductEditable && options[i].include())) {
                    value.push(options[i].id());
                    onceOffCost += options[i].variationCost();
                }
            }
            variationBuilt.value(value.join());
            variationBuilt.onceOffCost(onceOffCost);
        } else {
            variationBuilt.value(this.defaultValue());
            variationBuilt.unitCost(this.variationUnitCost());
            variationBuilt.onceOffCost(this.variationCost());
        }
        variationBuilt.unitCostTotal('0');
        variationBuilt.cost(variationBuilt.onceOffCost());
        variationBuilt.variationField(clone(this));
        variationBuilt.selectableOptions(selectableOptions);
        return variationBuilt;
    };

    this.optionsHaveCost = function () {
        var i, options, o;
        function hasCost(cost) {
            return !isUndefinedOrNull(cost);
        }
        if (this.isSelectable()) {
            options = this.options();
            for (i = 0; i < options.length; i++) {
                o = options[i];
                if (hasCost(o.variationCost()) ||
                    hasCost(o.variationUnitCost())) {
                    return true;
                }
            }
        }
        return false;
    }
}
