import { Component } from './component';
import { Entity } from '../entity';

export class ComponentTag extends Entity {
  protected static resourceName = 'component_tags';
  protected static singularName = 'componentTag';
  protected static pluralName = 'componentTags';

  @ComponentTag.property()
  public id?: number;

  @ComponentTag.property()
  public name?: string;

  @ComponentTag.property()
  public component?: Component;
}
