import { Dictionary } from './dictionary.js';

export function Set() {

    var store = new Dictionary();

    this.add = function (value) {
        store.add(value, value);
    };

    this.has = function (value) {
        return store.has(value);
    };

    this.each = function (procedure) {
        store.each(function (name, value) { procedure(value); });
        return this;
    };

    this.values = function () {
        return store.values();
    };

    this.remove = function (value) {
        store.remove(value);
        return this;
    };
}
