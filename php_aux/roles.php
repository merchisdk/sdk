<?php

class Roles
{
    /*
    Defines the types ("roles") of user accounts that can exist
    in the system. The information is stored per user as user.role. The role of
    the logged in user making a request is used by the permissions system and
    impacts the data that the user is allowed to access, as well as, in some
    cases, the layout of the page that they see on the frontend. The roles
    themselves are defined as integer constants
    */
    const _PUBLIC = 0;  // _ because public is a php keyword
    const ADMIN = 1;
    const SALES = 2;
    const DESIGNER = 3;
    const SUPPLIER = 4;
    const CLIENT = 5;
    const MANAGER = 6;
    const ACCOUNTANT = 7;

    const ROLE_STRINGS = array(
                _PUBLIC => "public",
                ADMIN => "admin",
                SALES => "sales",
                DESIGNER => "designer",
                SUPPLIER => "supplier",
                CLIENT => "client",
                MANAGER => "manager",
                ACCOUNTANT => "accountant");

    const ROLE_CSS_CLASS = array(
                  _PUBLIC => "default",
                  ADMIN => "inverse",
                  SALES => "success",
                  DESIGNER => "success",
                  SUPPLIER => "warning",
                  CLIENT => "danger",
                  MANAGER => "primary",
                  ACCOUNTANT => 'info');

    $ROLE_INTS = array();
    foreach(ROLE_STRINGS as $key => $value)
    {
        $ROLE_INTS[$value] = $key;
    }

    const BUSINESS_ACCOUNTS = array(SALES, DESIGNER, SUPPLIER, MANAGER, ACCOUNTANT, ADMIN);
    const ACCOUNTS = array(SALES, DESIGNER, SUPPLIER, MANAGER, ACCOUNTANT, ADMIN, CLIENT);
    const ALL_ROLES = array(SALES, DESIGNER, SUPPLIER, MANAGER, ACCOUNTANT, ADMIN, CLIENT,_PUBLIC);

    const SYSTEM_SECTION = array(ADMIN);
    const USER_SECTION = array(ADMIN);
    const INFO_SECTION = array(ADMIN, _PUBLIC);

    const DESIGN_SECTION = array(ADMIN, MANAGER, DESIGNER, CLIENT, _PUBLIC);
    const PRODUCTION_SECTION = array(ADMIN, MANAGER, SUPPLIER);
    const SHIPPING_SECTION = array(ADMIN, MANAGER, DESIGNER, CLIENT);

    const ALLOWED_SIGN_UP_ROLES = array(DESIGNER, CLIENT, SUPPLIER);

    const INVOICE_ROLES = array(ADMIN, MANAGER, ACCOUNTANT);

    function role_string($role_code){
        /*
        Given integer role_code denoting a users role, return a lower case
        string naming that role. Defaults to 'public' if the code is not
        known.
        */
        try {
            return ROLE_STRINGS[$role_code];
        } catch (Exception $e) {
            return 'public';
        }

    }

    const OPTIONS_ORDER = array(CLIENT, SUPPLIER, SALES, DESIGNER, MANAGER, ADMIN, ACCOUNTANT);

    const MANAGER_OPTIONS_ORDER = array(CLIENT, SUPPLIER, DESIGNER, MANAGER);

    $ROLE_OPTIONS = array();
    foreach(OPTIONS_ORDER as $key=>$value){
        $temp = array($value,role_string($value));
        array_push($ROLE_OPTIONS, $temp);
    }

    $MANAGER_ROLE_OPTIONS = array();
    foreach(MANAGER_OPTIONS_ORDER as $key=>$value){
        $temp = array($value,role_string($value));
        array_push($MANAGER_ROLE_OPTIONS, $temp);
    }
}
$roles = new Roles();
