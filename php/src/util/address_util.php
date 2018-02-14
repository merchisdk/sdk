<?php

require_once 'country_code.php';

function address_country($code){
    /*
        Take a 2 char country code like 'AU' and return the associated country
        name, i.e. 'Australia' as a string
    */
    global $countries;
    $country_name = $countries[$code];
    return $country_name;
}

function name_primary($counter, $name){
    /*
        Add '(Primary)' onto a address name if the address is set
        as primary
    */
    if ($counter == 0){
        $name .= " (Primary)";
    }
    return $name;
}
