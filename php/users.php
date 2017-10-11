<?php

require_once 'entity.php';
require_once 'email_addresses.php';
require_once 'addresses.php';
require_once 'phone_numbers.php';
require_once 'companies.php';

class User extends Entity
{
    public static $json_name = 'User';
    public static $resource = '/users/';


    public function __construct() {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('password', 'string');
        $this->json_property('reset_token', 'string');
        $this->json_property('timezone', 'integer');
        $this->json_property('emailAddresses', 'EmailAddress', $many = True,
                             $recursive = True);
        $this->json_property('address', 'Address', $many = True,
                             $recursive = True);
        $this->json_property('phoneNumbers', 'PhoneNumber', $many = True,
                             $recursive = True);
        $this->json_property('companies', 'Company', $many = True,
                             $recursive = True);
        $this->json_property('domain', 'Domain', $many = False,
                             $default = '1', $recursive = True);
    }
}

