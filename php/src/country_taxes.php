<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'util/country_code.php';

class CountryTax extends Entity
{
    public static $resource = '/country_taxes/';
    public static $json_name = 'countryTax';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('country', 'string');
        $this->json_property('tax_name', 'string');
        $this->json_property('tax_percent', 'float');
        $this->json_property('shipments', 'Shipment', $many = True, $recursive = True);
        $this->json_property('company', 'Company', $many = False, $recursive = True);
        $this->json_property('jobs', 'Job', $many = True, $recursive = True);
        $this->json_property('items', 'Item', $many = True, $recursive = True);

    }

    static function get_no_tax()
    {
        $result = new CountryTax();
        $result->id = 3; // 3 is a reserved id for 'no tax' by the backend
        $result->tax_name = 'No tax';
        $result->tax_percent = 0;
        return $result;
    }

    function country_name()
    {
        global $COUNTRIES;
        if ($this->country) {
            return $COUNTRIES[$this->country];
        } else {
            return "World Wide";
        }
    }

    function full_name()
    {
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
