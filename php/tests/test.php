<?php
declare(strict_types = 1);

use PHPUnit\Framework\TestCase;

require_once 'php/src/products.php';
require_once 'php/src/bid_items.php';

final class PhpSuite extends TestCase
{
    public function testCanCreateProduct()
    {
        new Product();
    }

    public function testBidItem()
    {
        $item = new BidItem();
        $item->quantity = 222;
        $item->unit_price = 4;
        $item->type = 1;

        $this->assertEquals($item->item_total(), 888);
        $this->assertEquals($item->item_type_name(), 'Shipping');
    }
}
