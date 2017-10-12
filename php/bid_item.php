<?php

require_once 'entity.php';

class BidItem extends Entity
{
    public static $resource = '/bid_items';
    public static $json_name = 'bid_item';


    public function __construct(){
        $this->json_property('id','integer');
        $this->json_property('type','integer');
        $this->json_property('quantity','integer');
        $this->json_property('description','string');
        $this->json_property('unit_price','float');
  }
}

class BidItems extends resource
{
    public function __construct(){
        $this->entity_class = 'BidItem';
        $this->json_name = 'bidItem';
    }
}

$bit_items = new BidItems();
