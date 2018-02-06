<?php

require_once 'entity.php';

class PhoneNumber extends Entity
{
    public static $json_name = 'phoneNumber';
    public static $resource = '/phone_number/';


    public function __construct() {
        $this->json_property('id', 'integer');
        $this->json_property('number', 'string');
        $this->json_property('code', 'string');
    }
}
