<?php
declare(strict_types = 1);

use PHPUnit\Framework\TestCase;

require_once 'php/src/products.php';
require_once 'php/src/util/address.php';
require_once 'php/src/util/money_protocol.php';

final class PhpSuite extends TestCase
{
    public function testCanCreateProduct()
    {
        new Product();
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
