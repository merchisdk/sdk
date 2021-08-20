import { Dictionary } from './dictionary';

export const themeStatus = new Dictionary();
themeStatus.add("NOT_VALID", 1);
themeStatus.add("VALID_BUT_NOT_UPDATED", 2);
themeStatus.add("VALID_AND_UPDATED", 3);
