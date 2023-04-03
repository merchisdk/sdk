import { Entity } from '../entity';
import { User } from './user';

export class ThemeCssSetting extends Entity {
  protected static resourceName = 'theme_css_settings';
  protected static singularName = 'themeCssSetting';
  protected static pluralName = 'themeCssSettings';

  @ThemeCssSetting.property()
  public id?: number;

  @ThemeCssSetting.property({type: Date})
  public created?: Date | null;

  @ThemeCssSetting.property({type: User})
  public createdBy?: User | null;

  @ThemeCssSetting.property()
  public allowedAttributes?: string;

  @ThemeCssSetting.property()
  public notAllowedAttributes?: string;
}
