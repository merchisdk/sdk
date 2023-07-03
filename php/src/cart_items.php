<?php
declare(strict_types=1);

require_once 'entity.php';

class CartItem extends Entity
{
    public static $json_name = 'cart_item';
    public static $resource = '/cart_items/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('quantity', 'integer');
        $this->json_property('notes', 'string');
        $this->json_property('creation_date', 'integer');
        $this->json_property('currency', 'string');
        $this->json_property('subtotal_cost', 'integer');
        $this->json_property('tax_amount', 'integer');
        $this->json_property('total_cost', 'integer');


        $this->json_property('product', 'Product', $many = False,
            $recursive = True);
        $this->json_property('cart', 'Cart', $many = False,
            $recursive = True);
        $this->json_property('tax_type', 'CountryTax', $many = False,
            $recursive = True);
        $this->json_property('variations_groups', 'VariationsGroup', $many = True,
            $recursive = True);
        $this->json_property('variations', 'Variation', $many = True,
            $recursive = True);
    }

    public function requires_shipment()
    {
        if (!$this->product) {
            throw new Exception('product is undefined, did you forget to embed it?');
        }
        if (!$this->product->needs_shipping) {
            throw new Exception('needsShipping is undefined, did you forget to embed it?');
        }
        return $this->product->needs_shipping;
    }
}
