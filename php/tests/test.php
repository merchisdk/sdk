<?php
declare(strict_types = 1);

use PHPUnit\Framework\TestCase;

require_once 'php/src/products.php';
require_once 'php/src/backups.php';
require_once 'php/src/bank.php';
require_once 'php/src/bid_items.php';
require_once 'php/src/util/address.php';
require_once 'php/src/util/money_protocol.php';

final class PhpSuite extends TestCase
{
    public function testCanCreateProduct()
    {
        $this->assertNotNull(new Product());
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

    public function testCanCreateBackup()
    {
        $this->assertNotNull(new Backup());
    }

    public function testCanCreateBank()
    {
        $this->assertNotNull(new Bank());
    }

    public function testAddressCountry()
    {
        $this->assertEquals(address_country('AU'), 'Australia');
    }

    public function testFormatCurrency()
    {
        $this->assertEquals(format_currency(200.234, 'AUD', 1), '$200.2');
    }
}
