<?php

require_once 'entity.php';
require_once 'bid_item.php';

function addup_subtotal($prev_total, $b){
    /* Return the value of object.quantity * object.unit_price */
    return $prev_total + ($b->quantity * $b->unit_price);
}

class Bid extends Entity
{
    public static $resource = '/bids/';
    public static $json_name = 'bid';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('id','integer');
        $this->json_property('agreed_deadline','DateTime');
        $this->json_property('assignments','Assignment', $default = [],
                             True, $recursive = True);
        $this->json_property('bid_items','BidItem', $default = [],
                             True, $recursive = True);
    }

    public function bid_total()
    {
        /*
           calculate the bid sub total by adding
           all the bid_item totals together.
        */
        return round(array_reduce($this->bid_items, "addup_subtotal"), 2);
    }
}

class Bids extends Resource
{
    public function __construct()
    {
        $this->json_name = 'bids';
        $this->entity_class = 'Bid';
    }
}

$bids = new Bids();
