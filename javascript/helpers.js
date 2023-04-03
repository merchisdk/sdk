import { isBrowser, isJsDom } from "browser-or-node";

export function id(x) {
    return x;
}

export function isUndefined(x) {
    return x === undefined;
}

export function notEmpty(value) {
    return !(isUndefined(value) || value === null || value === "");
}

export function isNull(x) {
    return x === null;
}

export function isUndefinedOrNull(x) {
    return isUndefined(x) || isNull(x);
}

export function getGlobal() {
    if (isBrowser || isJsDom) {
        return window;
    }
    return global;
}

export function isArray(x) {
    return Array.isArray(x);
}

export function notEmptyArray(array) {
    return isArray(array) && array.length > 0;
}

export function removeObjectFromArrayBasedOnCondition(array, condition) {
    array.splice(array.findIndex(condition), 1);
}

export function removeObjectFromArrayWithIntegerValue(array, objectKey, value) {
    var key = !objectKey ? objectKey : 'id',
        intValue = parseInt(value, 10);
    removeObjectFromArrayBasedOnCondition(array, function (obj) {
        return obj[key]() === intValue;
    });
}

export function clone(oldObject) {
    return Object.assign(oldObject, {});
}

export function any(iterable, condition) {
    for (var index = 0; index < iterable.length; ++index) {
        if (!isUndefined(condition) && condition(iterable[index])) {
            return true;
        } else if (iterable[index]) {
            return true;
        }
    }
    return false;
}

export function sortArray(array, objectKey, desc) {
    return array ? array.sort(function (a, b) {
        if (desc) {
            return b[objectKey]() - a[objectKey]();
        } else {
            return a[objectKey]() - b[objectKey]();
        }
    }) : [];
}

export function sortArrayByObjectKey(array, objectKey) {
    return sortArray(array, objectKey);
}

export function sortArrayByObjectKeyDescending(array, objectKey) {
    return sortArray(array, objectKey, true);
}
