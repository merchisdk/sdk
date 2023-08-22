<?php

declare(strict_types=1);

require_once 'entity.php';

class CartShipmentGroup extends Entity
{
    public static $json_name = 'cart_shipment_group';
    public static $resource = '/cart_shipment_groups/';


    public function __construct()
    {
        $this->json_property('id', 'integer');

        $this->json_property('cartItems', 'CartItem', $many = True,
            $recursive = True);
        $this->json_property('quotes', 'CartShipmentQuote', $many = True,
            $recursive = True);
        $this->json_property('selectedQuote', 'CartShipmentQuote', $many = False,
            $recursive = True);
    }
}
