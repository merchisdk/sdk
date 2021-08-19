export function Dictionary() {

    var store = {},
        count = 0;

    function noSuchKey(name) {
        throw 'No such key "' + String(name) + '" in dictionary';
    }

    this.clone = function () {
        return new Dictionary(store, count);
    };

    this.add = function (name, value) {
        if (!this.has(name)) {
            ++count;
        }
        store[name] = value;
        return this;
    };

    this.getArray = function (names) {
    /** passing a array of keys return the values array
     * corresponding to the keys **/
        var i, returnArray = [];
        for (i = 0; i < names.length; i++) {
            if (this.has(names[i])) {
                returnArray.push(store[names[i]]);
            } else {
                noSuchKey(names[i]);
            }
        }
        return returnArray;
    };

   this.get = function (name, default_) {
        if (this.has(name)) {
            return store[name];
        }
        if (default_ !== undefined) {
            return default_;
        }
        return noSuchKey(name);
    };

    this.has = function (name) {
        return Object.prototype.hasOwnProperty.call(store, name) &&
            Object.prototype.propertyIsEnumerable.call(store, name);
    };

    this.remove = function (name) {
        if (this.has(name)) {
            delete store[name];
            --count;
            return this;
        }
        return noSuchKey(name);
    };

    this.merge = function (other) {
        var _this = this;
        if (other.__proto__.constructor === Dictionary) {
            other.each(function (name, value) {
                _this.add(name, value);
            });
        } else {
            for (var property in other) {
                if (other.hasOwnProperty(property)) {
                    _this.add(property, other[property]);
                }
            }
        }
        return this;
    };

   this.each = function (procedure) {
        var name;
        for (name in store) {
            if (Object.prototype.hasOwnProperty.call(store, name)) {
                procedure(name, store[name]);
            }
        }
        return this;
    };

    this.keys = function () {
        var result = [];
        this.each(function (name) { result.push(name); });
        return result;
    };

    this.values = function () {
        var result = [];
        this.each(function (ignore, value) { result.push(value); });
        return result;
    };

    this.count = function () {
        return count;
    };

    this.toFormData = function () {
        var result = new FormData();
        this.each(function (key, value) {
            result.append(key, value);
        });
        return result;
    };

   this.toUriEncoding = function () {
        var result = '';
        this.each(function (key, value) {
            if (typeof key === "object") {
                throw "cannot URI encode object key";
            }
            if (typeof value === "object") {
                throw "cannot URI encode object name";
            }
            result += encodeURIComponent(key);
            result += '=';
            result += encodeURIComponent(value);
            result += '&';
        });
        return result.slice(0, -1);
    };

}
