export function id(x) {
    return x;
}

export function isUndefined(x) {
    return x === undefined;
}

export function notEmpty(value) {
    return !(isUndefined(value) || value === null || value === "");
}
