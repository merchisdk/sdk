<?php

const DEFAULT_TIMEZONE = "Australia/Melbourne";

$TIMEZONE_OPTIONS = [];

foreach(timezone_identifiers_list() as $key => $zone) {
    $TIMEZONE_OPTIONS[] = [$zone, $zone];
}
