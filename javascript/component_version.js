import { generateUUID } from './uuid.js';
import { addPropertyTo } from './model.js';
import { Component } from './component.js';

export function ComponentVersion() {
    this.json = 'componentVersion';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'archived');
    addPropertyTo(this, 'component', Component);
    addPropertyTo(this, 'created');
    addPropertyTo(this, 'isClassBased');
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'body');
}
