<?php

require_once 'entity.php';

class PhoneNumber extends Entity
{
    public static $json_name = 'phone_numbers';
    public static $resource = '/phone_numbers/';


    public function __construct() {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('number', 'string');
        $this->json_property('code', 'string');
        $this->json_property('local_format_number', 'string');
        $this->json_property('international_format_number', 'string');
    }
}

class PhoneNumbers extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'PhoneNumber';
        $this->json_name = 'phone_numbers';
    }
}

$phone_numbers = new PhoneNumbers();
