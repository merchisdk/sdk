<?php

require_once 'entity.php';
require_once './../php_aux/country_code.php';

class CountryTax extends Entity
{
    public static $resource = '/country_taxes/';
    public static $json_name = 'countryTax';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('country', 'string');
        $this->json_property('tax_name', 'string');
        $this->json_property('tax_percent', 'float');
    }

    function country_name(){
        if ($this->country){
            return countries[$this->country];
        } else{
            return "World Wide";
        }
    }

    function full_name(){
        $format = "%s (%s)";
        return sprintf($format, $this->tax_name, $this->country_name());
    }
}

class CountryTaxes extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'CountryTax';
        $this->json_name = 'countryTaxes';
    }
}

$country_taxes = new CountryTaxes();
