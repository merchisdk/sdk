import { Domain } from './domain';
import { Entity } from '../entity';

export class SeoDomainPage extends Entity {
  protected static resourceName: string = 'seo_domain_pages';
  protected static singularName: string = 'seoDomainPage';
  protected static pluralName: string = 'seoDomainPages';

  @SeoDomainPage.property({type: Date})
  public archived?: Date | null;

  @SeoDomainPage.property()
  public id?: number;

  @SeoDomainPage.property()
  public domain?: Domain;

  @SeoDomainPage.property()
  public metaDescription?: string;

  @SeoDomainPage.property()
  public metaRobots?: string;

  @SeoDomainPage.property()
  public metaTitle?: string;

  @SeoDomainPage.property()
  public pageKey?: string;
}
