<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'products.php';

class DiscountGroups extends Entity
{
    public static $resource = '/discount_groups/';
    public static $json_name = 'discount_group';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('discount_type', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('product', 'Product', $many = False, $recursive = True);
        $this->json_property('discounts', 'Discount', $many = True, $recursive = True);
    }
}


