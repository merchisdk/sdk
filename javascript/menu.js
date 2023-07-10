import generateUUID from './uuid.js';
import { addPropertyTo, fromJson, getOne, deleteOne } from './model.js';
import { MenuItem } from './menu_item.js';

export function Menu() {
    this.resource = '/menus';
    this.json = 'menu';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'menuHandle');
    addPropertyTo(this, 'menuType');
    addPropertyTo(this, 'menuItems', MenuItem);

    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error,
                embed: embed});
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };
}
