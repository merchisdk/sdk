import { cloneDeepWith } from 'lodash';
import { DiscountGroup } from './discount_group';
import { Entity } from '../entity';
import { Product } from './product';
import { Variation } from './variation';
import { VariationFieldsOption } from './variation_fields_option';
import { FieldType } from '../constants/field_types';

export class VariationField extends Entity {
  protected static resourceName = 'variation_fields';
  protected static singularName = 'variationField';
  protected static pluralName = 'variationFields';

  @VariationField.property({type: Date})
  public archived?: Date | null;

  @VariationField.property()
  public id?: number;

  @VariationField.property()
  public position?: number;

  @VariationField.property()
  public required?: boolean;

  @VariationField.property()
  public independent?: boolean;

  @VariationField.property()
  public name?: string;

  @VariationField.property({type: String})
  public placeholder?: string | null;

  @VariationField.property()
  public defaultValue?: string;

  @VariationField.property()
  public currency?: string;

  @VariationField.property()
  public fieldType?: FieldType;

  @VariationField.property()
  public margin?: number;

  @VariationField.property()
  public variationCost?: number;

  @VariationField.property({type: 'DiscountGroup'})
  public variationCostDiscountGroup?: DiscountGroup | null;

  @VariationField.property()
  public variationUnitCost?: number;

  @VariationField.property({embeddedByDefault: false})
  public buyUnitCost?: number;

  @VariationField.property({embeddedByDefault: false})
  public buyCost?: number;

  @VariationField.property({type: 'DiscountGroup'})
  public variationUnitCostDiscountGroup?: DiscountGroup | null;

  @VariationField.property()
  public rows?: number;

  @VariationField.property({type: Number})
  public fieldMin?: number | null;

  @VariationField.property({type: Number})
  public fieldMax?: number | null;

  @VariationField.property()
  public allowDecimal?: boolean;

  @VariationField.property()
  public sellerProductEditable?: boolean;

  @VariationField.property()
  public multipleSelect?: boolean;

  @VariationField.property()
  public showFilePreview?: boolean;

  @VariationField.property()
  public allowFileMultiple?: boolean;

  @VariationField.property()
  public allowFileJpeg?: boolean;

  @VariationField.property()
  public allowFileGif?: boolean;

  @VariationField.property()
  public allowFilePdf?: boolean;

  @VariationField.property()
  public allowFilePng?: boolean;

  @VariationField.property()
  public allowFileAi?: boolean;

  @VariationField.property()
  public product?: Product;

  @VariationField.property({arrayType: 'Variation'})
  public variations?: Variation[];

  @VariationField.property({arrayType: 'VariationFieldsOption'})
  public options?: VariationFieldsOption[];

  public isSelectable = () => {
    if (this.fieldType === undefined) {
      throw new Error('fieldType is undefined, did you forget to embed it?');
    }
    const selectable = new Set([FieldType.SELECT,
      FieldType.CHECKBOX,
      FieldType.RADIO,
      FieldType.IMAGE_SELECT,
      FieldType.COLOUR_SELECT]);
    return selectable.has(this.fieldType);
  };

  public buildEmptyVariation = () => {
    if (this.defaultValue === undefined) {
      throw new Error('defaultValue is undefined, did you forget to embed it?');
    }
    if (this.variationCost === undefined) {
      const err = 'variationCost is undefined, did you forget to embed it?';
      throw new Error(err);
    }
    if (this.options === undefined) {
      throw new Error('options is undefined, did you forget to embed it?');
    }
    const result = new this.merchi.Variation(this.merchi);
    result.selectableOptions = [];
    if (this.isSelectable()) {
      let onceOffCost = 0;
      const value = [];
      for (const option of this.options) {
        if ((this.sellerProductEditable && option.include) ||
          (!this.sellerProductEditable && option.default)) {
          if (option.variationCost === undefined) {
            throw new Error('option.variationCost is undefined, did you ' +
                            'forget to embed it?');
          }
          value.push(option.id);
          onceOffCost += option.variationCost;
        }
        result.selectableOptions.push(option.buildVariationOption());
      }
      result.value = value.join();
      result.onceOffCost = onceOffCost;
    } else {
      result.value = this.defaultValue;
      result.onceOffCost = this.variationCost;
    }
    result.unitCostTotal = 0;
    result.cost = result.onceOffCost;
    function customiser(value: any, index: any) {
      if (index === 'merchi') {
        return value;
      }
    }
    result.variationField = cloneDeepWith(this, customiser);
    return result;
  };
}
