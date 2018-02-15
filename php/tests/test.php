<?php
declare(strict_types = 1);

use PHPUnit\Framework\TestCase;

require_once 'php/src/country_taxes.php';
require_once 'php/src/component_tags.php';
require_once 'php/src/products.php';
require_once 'php/src/domain_invitations.php';
require_once 'php/src/discounts.php';
require_once 'php/src/backups.php';
require_once 'php/src/bank.php';
require_once 'php/src/bid_items.php';
require_once 'php/src/util/address.php';
require_once 'php/src/categories.php';

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

    public function testCanCreateCategory()
    {
        $this->assertNotNull(new Category());
    }

    public function testCanCreateBackup()
    {
        $this->assertNotNull(new Backup());
    }

    public function testCanCreateBank()
    {
        $this->assertNotNull(new Bank());
    }

    public function testCanCreateComponentTag()
    {
        $this->assertNotNull(new ComponentTag());
    }

    public function testCanCreateDiscount()
    {
        $this->assertNotNull(new Discount());
    }

    public function testCanCreateDomainInvitation()
    {
        $this->assertNotNull(new DomainInvitation());
    }

    public function testAddressCountry()
    {
        $this->assertEquals(address_country('AU'), 'Australia');
    }

    public function testCountryTax()
    {
        $tax = new CountryTax();
        $tax->country = 'AU';
        $tax->tax_name = 'GST';

        $this->assertEquals($tax->country_name(), 'Australia');
        $this->assertEquals($tax->full_name(), 'GST (Australia)');
    }
}
