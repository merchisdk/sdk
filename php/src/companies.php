<?php

require_once 'entity.php';

class Company extends Entity
{
    public static $json_name = 'company';
    public static $resource = '/companies/';


    public function __construct() {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('default_currency', 'string');
        $this->json_property('paypal_account', 'string');
        $this->json_property('paypal_password', 'string');
        $this->json_property('paypal_signature', 'string');
        $this->json_property('stripe_publishable_key', 'string');
        $this->json_property('stripe_api_key', 'string');
        $this->json_property('emailAddresses', 'EmailAddress', $many = True,
                             $recursive = True);
        $this->json_property('phoneNumbers', 'PhoneNumber', $many = True,
                             $recursive = True);
        $this->json_property('addresses', 'Address', $many = True,
                             $recursive = True);
        $this->json_property('banks', 'Bank', $many = True,
                             $recursive = True);
    }
}
