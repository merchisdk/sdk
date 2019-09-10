import { Component } from './component';
import { Entity } from '../entity';

export class ComponentTag extends Entity {
  protected static resourceName: string = "component_tags";
  protected static singularName: string = "componentTag";
  protected static pluralName: string = "componentTags";

  @ComponentTag.property("id")
  public id?: number;

  @ComponentTag.property("name")
  public name?: string;

  @ComponentTag.property("component")
  public component?: Component;
}
