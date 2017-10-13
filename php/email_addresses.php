<?php

require_once 'entity.php';

class EmailAddress extends Entity
{
    public static $json_name = 'emailAddress';
    public static $resource = '/email_addresses/';


    public function __construct() {
        $this->json_property('id', 'integer');
        $this->json_property('emailAddress', 'string');
    }
}

class EmailAddresses extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'EmailAddress';
        $this->json_name = 'eamilAddress';
    }
}

$email_addresses = new EmailAddresses();
