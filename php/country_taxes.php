<?php

require_once 'entity.php';

class CountryTax extends Entity
{
    public static $resource = '/country_taxes/';
    public static $json_name = 'countryTax';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('country', 'string');
        $this->json_property('tax_name', 'string');
        $this->json_property('tax_percent', 'float');
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
