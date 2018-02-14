<?php

const TEXT_INPUT = 1;
const SELECT = 2;
const FILE_UPLOAD = 3;
const TEXT_AREA = 4;
const NUMBER = 5;
const CHECKBOX = 6;
const RADIO = 7;
const FIELD_INSTRUCTIONS = 8;
const IMAGE_SELECT = 9;
const COLOUR_PICKER = 10;
const COLOUR_SELECT = 11;


const specification_fields_array = [
    TEXT_INPUT => "Text Input",
    SELECT => "Select",
    FILE_UPLOAD => "File Upload",
    TEXT_AREA => 'Text Area',
    NUMBER => 'Number Input',
    CHECKBOX => "Checkbox",
    RADIO => "Radio",
    FIELD_INSTRUCTIONS => 'Field Instructions',
    IMAGE_SELECT => 'Image Select',
    FIELD_INSTRUCTIONS => "Field Instructions",
    COLOUR_PICKER => "Colour Picker",
    COLOUR_SELECT => "Colour Select"
];

const has_options_array = [SELECT, CHECKBOX, RADIO, IMAGE_SELECT, COLOUR_SELECT];
