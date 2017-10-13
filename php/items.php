<?php

require_once 'entity.php';
require_once 'invoices.php';
require_once 'country_taxes.php';

class Item extends Entity
{
    public static $resource = '/items/';
    public static $json_name = 'item';

    public function __construct()
    {
        $this->escape_fields = ['tax_type'];
        $this->json_property('id', 'integer');
        $this->json_property('cost','float');
        $this->json_property('description','string');
        $this->json_property('tax_amount','float');
        $this->json_property('quantity','float');
        $this->json_property('invoice', 'Invoice', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('tax_type', 'CountryTax', $many = False,
                             $default = '1', $recursive = True);
    }
}

class Items extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Item';
        $this->json_name = 'items';
    }
}

$items = new Items();
