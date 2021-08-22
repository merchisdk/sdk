import { generateUUID } from './uuid';
import { addPropertyTo } from './model';

export function MenuItem() {
    this.resource = '/menu_items';
    this.json = 'menuItem';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'linkType');
    addPropertyTo(this, 'linkUri');
    addPropertyTo(this, 'position');

    this.url = function (domain) {
        if (domain && this.linkType() === 1) {
            return 'http://' + domain.subDomain() + '.' + window.server +
               '/' + this.linkUri();
        }
        return this.linkUri();
    };
}
