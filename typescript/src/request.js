var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// eslint-disable-next-line no-unused-vars
import { getErrorFromCode } from './constants/errors';
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(err) {
        var _this = this;
        var message = JSON.stringify(err);
        /* istanbul ignore next */
        _this = _super.call(this, message) || this;
        _this.statusCode = err.statusCode;
        _this.errorCode = getErrorFromCode(err.errorCode);
        _this.name = 'ApiError';
        _this.original = err;
        return _this;
    }
    return ApiError;
}(Error));
export { ApiError };
export function backendFetch(resource, options) {
    var e_1, _a;
    var server = window.merchiBackendUri
        ? window.merchiBackendUri
        : BACKEND_URI;
    var version = 'v6';
    var url = new URL(server + version + resource);
    if (options && options.query) {
        try {
            for (var _b = __values(options.query), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                url.searchParams.append(entry[0], entry[1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return fetch(url.toString(), options);
}
export function apiFetch(resource, options, expectEmptyResponse) {
    return backendFetch(resource, options).then(function (response) {
        if (response.status < 200 || response.status > 299) {
            return response.json().then(function (json) {
                var err = new ApiError(json);
                return Promise.reject(err);
            });
        }
        else {
            return expectEmptyResponse ? '' : response.json();
        }
    });
}
