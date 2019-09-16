import { Entity } from '../entity';
import { Product } from './product';
import { Variation } from './variation';
import { VariationFieldsOption } from './variation_fields_option';

export class VariationField extends Entity {
  protected static resourceName: string = "variation_fields";
  protected static singularName: string = "variationField";
  protected static pluralName: string = "variationFields";

  @VariationField.property()
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

  @VariationField.property()
  public placeholder?: string | null;

  @VariationField.property()
  public defaultValue?: string;

  @VariationField.property()
  public fieldType?: number;

  @VariationField.property()
  public variationCost?: number;

  @VariationField.property()
  public rows?: number;

  @VariationField.property()
  public fieldMin?: number | null;

  @VariationField.property()
  public fieldMax?: number | null;

  @VariationField.property()
  public allowDecimal?: boolean;

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
  public variationUnitCost?: number;

  @VariationField.property("Variation")
  public variations?: Array<Variation>;

  @VariationField.property()
  public productGroupBackref?: Product | null;

  @VariationField.property()
  public productIndependentBackref?: Product | null;

  @VariationField.property("VariationFieldsOption")
  public options?: Array<VariationFieldsOption>;
}
