<?php

declare(strict_types=1);

require_once 'entity.php';

class CartShipmentQuote extends Entity
{
    public static $json_name = 'cart_shipment_quote';
    public static $resource = '/cart_shipment_quotes/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('subtotalCost', 'integer');
        $this->json_property('taxAmount', 'integer');
        $this->json_property('totalCost', 'integer');
        $this->json_property('shipmentServiceQuote', 'string');


        $this->json_property('shipmentService', 'ShipmentService', $many = True,
            $recursive = True);
        $this->json_property('shipmentMethod', 'ShipmentMethod', $many = True,
            $recursive = True);
    }
}
