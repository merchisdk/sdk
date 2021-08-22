import { Dictionary } from './dictionary';

export const fieldTypes = new Dictionary();

fieldTypes.add("TEXT_INPUT", 1);
fieldTypes.add("SELECT", 2);
fieldTypes.add("FILE_UPLOAD", 3);
fieldTypes.add("TEXT_AREA", 4);
fieldTypes.add("NUMBER_INPUT", 5);
fieldTypes.add("CHECKBOX", 6);
fieldTypes.add("RADIO", 7);
fieldTypes.add("FIELD_INSTRUCTIONS", 8);
fieldTypes.add("IMAGE_SELECT", 9);
fieldTypes.add("COLOUR_PICKER", 10);
fieldTypes.add("COLOUR_SELECT", 11);
