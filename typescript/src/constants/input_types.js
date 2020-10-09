export var InputType;
(function (InputType) {
    InputType[InputType["TEXT"] = 1] = "TEXT";
    InputType[InputType["SELECT"] = 2] = "SELECT";
    InputType[InputType["FILE"] = 3] = "FILE";
    InputType[InputType["TEXTAREA"] = 4] = "TEXTAREA";
    InputType[InputType["NUMBER"] = 5] = "NUMBER";
    InputType[InputType["CHECKBOX"] = 6] = "CHECKBOX";
    InputType[InputType["RADIO"] = 7] = "RADIO";
    InputType[InputType["INSTRUCTIONS"] = 8] = "INSTRUCTIONS";
    InputType[InputType["IMAGE_SELECT"] = 9] = "IMAGE_SELECT";
    InputType[InputType["COLUR_PICKER"] = 10] = "COLUR_PICKER";
    InputType[InputType["COLOUR_SELECT"] = 11] = "COLOUR_SELECT";
})(InputType || (InputType = {}));
