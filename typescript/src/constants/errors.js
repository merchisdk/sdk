export var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["UNKNOWN_ERROR"] = 0] = "UNKNOWN_ERROR";
    ErrorType[ErrorType["SERVER_ERROR"] = 1] = "SERVER_ERROR";
    ErrorType[ErrorType["CLIENT_ERROR"] = 2] = "CLIENT_ERROR";
    ErrorType[ErrorType["EMAIL_ALREADY_EXISTS"] = 3] = "EMAIL_ALREADY_EXISTS";
    ErrorType[ErrorType["SUPPLIER_NOT_ADDED_TO_PRODUCT"] = 4] = "SUPPLIER_NOT_ADDED_TO_PRODUCT";
    ErrorType[ErrorType["EMAIL_NOT_FOUND"] = 5] = "EMAIL_NOT_FOUND";
    ErrorType[ErrorType["INVALID_PHONE_NUMBER"] = 6] = "INVALID_PHONE_NUMBER";
    ErrorType[ErrorType["INVALID_PASSWORD"] = 7] = "INVALID_PASSWORD";
    ErrorType[ErrorType["RESOURCE_NOT_FOUND"] = 8] = "RESOURCE_NOT_FOUND";
    ErrorType[ErrorType["RESOURCE_GONE"] = 9] = "RESOURCE_GONE";
    ErrorType[ErrorType["REQUEST_TOO_LARGE"] = 10] = "REQUEST_TOO_LARGE";
    ErrorType[ErrorType["UNKNOWN_DOMAIN"] = 11] = "UNKNOWN_DOMAIN";
    ErrorType[ErrorType["UNSUPPORTED_METHOD"] = 12] = "UNSUPPORTED_METHOD";
    ErrorType[ErrorType["MISSING_EVENT_TYPES"] = 13] = "MISSING_EVENT_TYPES";
    ErrorType[ErrorType["INVALID_EVENT_TYPES"] = 14] = "INVALID_EVENT_TYPES";
    ErrorType[ErrorType["MISSING_URI"] = 15] = "MISSING_URI";
    ErrorType[ErrorType["MISSING_SID"] = 16] = "MISSING_SID";
    ErrorType[ErrorType["MISSING_SECRET_KEY"] = 17] = "MISSING_SECRET_KEY";
    ErrorType[ErrorType["MISSING_SUBSCRIPTION_TOKEN"] = 18] = "MISSING_SUBSCRIPTION_TOKEN";
    ErrorType[ErrorType["WRONG_SECRET_KEY"] = 19] = "WRONG_SECRET_KEY";
    ErrorType[ErrorType["DUPLICATE_SUBSCRIPTION_TOKEN"] = 20] = "DUPLICATE_SUBSCRIPTION_TOKEN";
    ErrorType[ErrorType["BAD_SMS_TOKEN"] = 21] = "BAD_SMS_TOKEN";
    ErrorType[ErrorType["DOMAIN_NOT_FOUND"] = 22] = "DOMAIN_NOT_FOUND";
})(ErrorType || (ErrorType = {}));
export function getErrorFromCode(code) {
    if (code in ErrorType) {
        return code;
    }
    return ErrorType.UNKNOWN_ERROR;
}
