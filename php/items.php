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
        parent::__construct();
        $this->escape_fields = ['tax_type'];
        $this->json_property('id', 'integer');
        $this->json_property('cost','float');
        $this->json_property('description','string');
        $this->json_property('tax_amount','float');
        $this->json_property('quantity','float');
        $this->json_property('invoice', 'Invoice', null,
                             False, $recursive = True);
        $this->json_property('tax_type', 'CountryTax', null,
                             False, $recursive = True);
    }

    function item_total(){
        /*Return the total value of the item
            by multiplying the quantity by the cost. This value
            is without GST.
        */
        return $this->cost * $this->quantity;
    }

    function item_tax(){
        #Return the total tax based on the total quantity
        return $this->tax_amount * $this->quantity;
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
