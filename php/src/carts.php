<?php
declare(strict_types=1);

require_once 'entity.php';

class Cart extends Entity
{
    public static $json_name = 'cart';
    public static $resource = '/carts/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('creation_date', 'integer');
        $this->json_property('ip', 'string');
        $this->json_property('token', 'string');
        $this->json_property('receiver_notes', 'string');
        $this->json_property('currency', 'string');
        $this->json_property('cart_items_subtotal_cost', 'integer');
        $this->json_property('cart_items_tax_amount', 'integer');
        $this->json_property('cart_items_total_cost', 'integer');
        $this->json_property('shipment_total_cost', 'integer');
        $this->json_property('subtotal_cost', 'integer');
        $this->json_property('tax_amount', 'integer');
        $this->json_property('total_cost', 'integer');

        $this->json_property('client', 'User', $many = False,
            $recursive = True);
        $this->json_property('client_company', 'Company', $many = False,
            $recursive = True);
        $this->json_property('domain', 'Domain', $many = False,
            $recursive = True);
        $this->json_property('invoice', 'Invoice', $many = False,
            $recursive = True);
        $this->json_property('receiver_address', 'Address', $many = False,
        $recursive = True);
        $this->json_property('cart_items', 'CartItem', $many = True,
            $recursive = True);
        $this->json_property('shipment_groups', 'CartShipmentGroup', $many = True,
            $recursive = True);
    }

    public function requires_shipment()
    {
        if ($this->cart_items) {
            foreach($this->cart_items as $cart_item){
                if ($cart_item.requires_shipment()) {
                    return True;
                }
            }
            return False;
        } else {
            throw new Exception('cart_items is undefined, did you forget to embed it?');
        }
    }
}
