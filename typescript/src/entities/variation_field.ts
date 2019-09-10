import { Entity } from '../entity';
import { Product } from './product';
import { Variation } from './variation';
import { VariationFieldsOption } from './variation_fields_option';

export class VariationField extends Entity {
  protected static resourceName: string = "variation_fields";
  protected static singularName: string = "variationField";
  protected static pluralName: string = "variationFields";

  @VariationField.property("archived")
  public archived?: Date | null;

  @VariationField.property("id")
  public id?: number;

  @VariationField.property("position")
  public position?: number;

  @VariationField.property("required")
  public required?: boolean;

  @VariationField.property("independent")
  public independent?: boolean;

  @VariationField.property("name")
  public name?: string;

  @VariationField.property("placeholder")
  public placeholder?: string | null;

  @VariationField.property("defaultValue")
  public defaultValue?: string;

  @VariationField.property("fieldType")
  public fieldType?: number;

  @VariationField.property("variationCost")
  public variationCost?: number;

  @VariationField.property("rows")
  public rows?: number;

  @VariationField.property("fieldMin")
  public fieldMin?: number | null;

  @VariationField.property("fieldMax")
  public fieldMax?: number | null;

  @VariationField.property("allowDecimal")
  public allowDecimal?: boolean;

  @VariationField.property("multipleSelect")
  public multipleSelect?: boolean;

  @VariationField.property("showFilePreview")
  public showFilePreview?: boolean;

  @VariationField.property("allowFileMultiple")
  public allowFileMultiple?: boolean;

  @VariationField.property("allowFileJpeg")
  public allowFileJpeg?: boolean;

  @VariationField.property("allowFileGif")
  public allowFileGif?: boolean;

  @VariationField.property("allowFilePdf")
  public allowFilePdf?: boolean;

  @VariationField.property("allowFilePng")
  public allowFilePng?: boolean;

  @VariationField.property("allowFileAi")
  public allowFileAi?: boolean;

  @VariationField.property("variationUnitCost")
  public variationUnitCost?: number;

  @VariationField.property("variations", "Variation")
  public variations?: Array<Variation>;

  @VariationField.property("productGroupBackref")
  public productGroupBackref?: Product | null;

  @VariationField.property("productIndependentBackref")
  public productIndependentBackref?: Product | null;

  @VariationField.property("options", "VariationFieldsOption")
  public options?: Array<VariationFieldsOption>;
}
