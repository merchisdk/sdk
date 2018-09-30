<?php

require_once "roles.php";

const SYSTEM = 0;
const USER = 1;
const JOB_INFO = 2;
const JOB_DRAFTING = 3;
const JOB_PRODUCTION = 4;
const JOB_INVOICING = 5;
const JOB_SHIPPING = 6;
const INVOICE = 7;
const JOB_NOTIFICATIONS = 8;
const REMINDER = 9;

const SECTION_ICON_CLASS = [SYSTEM => "fa fa-server",
                      USER => "fa fa-user",
                      JOB_INFO => "fa fa-info",
                      JOB_DRAFTING => "fa fa-paint-brush",
                      JOB_PRODUCTION => "fa fa-wrench",
                      JOB_INVOICING => "fa fa-file-pdf-o",
                      JOB_SHIPPING => "fa fa-truck",
                      INVOICE => 'fa fa-file-pdf-o',
                      REMINDER => 'fa fa-lightbulb-o'];

const SECTION_CLASS_NAME = [SYSTEM => "default",
                      USER => "danger",
                      JOB_INFO => "inverse",
                      JOB_DRAFTING => "success",
                      JOB_PRODUCTION => "warning",
                      JOB_INVOICING => "primary",
                      JOB_SHIPPING => "info",
                      INVOICE => 'primary',
                      REMINDER => 'default'];

const JOB_SECTION_STRINGS = [SYSTEM => "system",
                       USER => "user",
                       JOB_INFO => "info",
                       JOB_DRAFTING => "design",
                       JOB_PRODUCTION => "production",
                       JOB_INVOICING => "invoicing",
                       JOB_SHIPPING => "shipping",
                       INVOICE => 'invoice',
                       REMINDER => 'reminder'];

function section_string($section_code)
{
    /*
        Given integer section_code denoting the job section, return a
        lower case string naming that section. Defaults to 'system'
        if the code is not known.
    */

    return array_key_exists($section_code, JOB_SECTION_STRINGS) ? JOB_SECTION_STRINGS[$section_code] : "system";
}

// options needed for common users
const OPTIONS_ORDER_COMMON = [
                              USER,
                              JOB_INFO,
                              JOB_DRAFTING,
                              JOB_PRODUCTION,
                              JOB_INVOICING,
                              JOB_SHIPPING,
                              INVOICE,
                              REMINDER,];

const OPTIONS_ORDER_SUPER = [
                             USER,
                             JOB_INFO,
                             JOB_DRAFTING,
                             JOB_PRODUCTION,
                             JOB_INVOICING,
                             JOB_SHIPPING,
                             INVOICE,
                             REMINDER,
                             SYSTEM,];

$SECTION_OPTIONS_COMMON = [];
foreach (OPTIONS_ORDER_COMMON as $section) {
    $SECTION_OPTIONS_COMMON[] = [$section, section_string($section)];
}
unset($section);

$SECTION_OPTIONS_SUPER = [];
foreach (OPTIONS_ORDER_SUPER as $section) {
    $SECTION_OPTIONS_SUPER[] = [$section, section_string($section)];
}
unset($section);

/*
    This dictionary are used to check whether user with
    certain role have permission to write the notification
    of certain section
*/

const SECTION_ROLES = [JOB_INFO => INFO_SECTION,
     JOB_DRAFTING => DESIGN_SECTION,
     JOB_PRODUCTION => PRODUCTION_SECTION,
     JOB_SHIPPING => SHIPPING_SECTION,
     SYSTEM => SYSTEM_SECTION,
     USER => USER_SECTION];
