<?php

# Stage constant used to describe the the stage of theme

# theme is not valid
const NOT_VALID = 0;
# theme has a valid version but
# the latest edited version is not valid
const VALID_BUT_NOT_UPDATED = 1;
# THE LATEST EDITED VERSION IS VALID
const VALID_AND_UPDATED = 2;

const theme_status_description = [
    NOT_VALID => "This css is not valid and has no valid version.",
    VALID_BUT_NOT_UPDATED => "This css is not valid but has valid version.",
    VALID_AND_UPDATED => "This css is currently valid."
];
