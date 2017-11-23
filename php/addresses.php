<?php

require_once 'entity.php';
require_once './../php_aux/country_code.php';

class Address extends Entity
{
    public static $json_name = 'address';
    public static $resource = '/addresses/';


    public function __construct() {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('line_one', 'string');
        $this->json_property('line_two', 'string');
        $this->json_property('city', 'string');
        $this->json_property('state', 'string');
        $this->json_property('country', 'string');
        $this->json_property('postcode', 'string');
    }

    public function __repr(){
        $format = '%s,%s,%s,%s,%s';
        return sprintf($format,$this->line_one,$this->city,
        $this->state,$this->country,$this->postcode);
    }

    public function cloneAddress(){
        $clone_address = clone $this;
        $clone_address->id = null;
        return $clone_address;
    }

    public function country_name(){
        /*
          Convert the country initials into
          the country full name and returns the country
          full name
        */
        $country_name = $this->country;
        try {
            $country_name = countries[$this->country];
        } catch (Exception $e) {}

        return $country_name;

    }
}


class Addresses extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Address';
        $this->json_name = 'addresses';
    }
}

$addresses = new Addresses();
