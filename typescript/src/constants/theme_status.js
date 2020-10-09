export var ThemeStatus;
(function (ThemeStatus) {
    ThemeStatus[ThemeStatus["NOT_VALID"] = 1] = "NOT_VALID";
    ThemeStatus[ThemeStatus["VALID_BUT_NOT_UPDATED"] = 2] = "VALID_BUT_NOT_UPDATED";
    ThemeStatus[ThemeStatus["VALID_AND_UPDATED"] = 3] = "VALID_AND_UPDATED";
})(ThemeStatus || (ThemeStatus = {}));
