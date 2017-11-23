<?php

require_once 'entity.php';
require_once './../php_aux/item_types.php';

class BidItem extends Entity
{
    public static $resource = '/bid_items/';
    public static $json_name = 'bid_item';


    public function __construct(){
        parent::__construct();
        $this->json_property('id','integer');
        $this->json_property('type','integer');
        $this->json_property('quantity','integer');
        $this->json_property('description','string');
        $this->json_property('unit_price','float');
    }

    public function item_total(){
        /*
            Calculate the total of the item by
            multiplying the unit_price and quantity. It then
            returns the total
         */
        $total = $this->quantity * $this->unit_price;
        return $total;
    }

    public function item_type_name(){
        /* return name of the bid item type instead of type id*/
        return item_type[$this->type];
    }
}

class BidItems extends resource
{
    public function __construct(){
        $this->entity_class = 'BidItem';
        $this->json_name = 'bidItem';
    }
}

$bid_items = new BidItems();
