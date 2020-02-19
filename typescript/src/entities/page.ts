import { Entity } from '../entity';
import { Theme } from './theme';

export class Page extends Entity {
  protected static resourceName: string = "pages";
  protected static singularName: string = "page";
  protected static pluralName: string = "themes";

  @Page.property()
  public id?: number;

  @Page.property()
  public name?: string;

  @Page.property()
  public slug?: string;

  @Page.property()
  public template?: string;

  @Page.property()
  public js?: string;

  @Page.property()
  public html?: string;

  @Page.property({type: String})
  public error?: string | null;

  @Page.property({type: 'Theme'})
  public theme?: Theme;
}
