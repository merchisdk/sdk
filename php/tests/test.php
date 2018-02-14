<?php
declare(strict_types = 1);

use PHPUnit\Framework\TestCase;

require_once 'php/src/country_taxes.php';
require_once 'php/src/products.php';
require_once 'php/src/util/address.php';

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

    public function testCountryTax()
    {
        $tax = new CountryTax();
        $tax->country = 'AU';
        $tax->tax_name = 'GST';

        $this->assertEquals($tax->country_name(), 'Australia');
        $this->assertEquals($tax->full_name(), 'GST (Australia)');
    }
}
