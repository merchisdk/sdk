<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'products.php';

class Discount extends Entity
{
    public static $resource = '/discount/';
    public static $json_name = 'discount';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('lower_limit', 'float');
        $this->json_property('amount', 'float');
        $this->json_property('discount_group', 'DiscountGroup', $many = False, $recursive = True);
    }

    public function discounted_unit_cost(float $unit_price)
    {
        if (!$unit_price) {
            throw new Exception('unit_price is undefined, did you forget to embed it?');
        }
        if (!$this->amount) {
            throw new Exception('amount is undefined, did you forget to embed it?');
        }
        $discount = 100 - $this->amount;
        return round(($unit_price * $discount / 100), 3);
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
