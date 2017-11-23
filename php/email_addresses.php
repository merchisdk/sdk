<?php

require_once 'entity.php';

class EmailAddress extends Entity
{
    public static $json_name = 'email_address';
    public static $resource = '/email_addresses/';


    public function __construct() {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('email_address', 'string');
    }
}

class EmailAddresses extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'EmailAddress';
        $this->json_name = 'eamil_addresses';
    }
}

$email_addresses = new EmailAddresses();
