<?php

require_once 'entity.php';
require_once 'products.php';

class Discount extends Entity
{
    public static $resource = '/discount/';
    public static $json_name = 'discount';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('lower_limit', 'float');
        $this->json_property('amount', 'float');
        $this->json_property('product', 'Product', '',
                             False, $recursive = True);
    }
}

class Discounts extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Discount';
        $this->json_name = 'discounts';
    }
}

$discounts = new Discounts();
