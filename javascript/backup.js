import { addPropertyTo, deleteOne, fromJsonList, getList } from './model.js'
import { MerchiFile } from './merchi_file.js';

export function Backup() {
    this.resource = '/backups';
    this.json = 'backup';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'file', MerchiFile);

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };
}

export function Backups() {
    this.resource = '/backups';
    this.json = 'backups';
    this.single = Backup;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error,
                parameters);
    };
}
