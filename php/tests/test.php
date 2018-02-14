<?php
declare(strict_types = 1);

use PHPUnit\Framework\TestCase;

require_once 'php/src/products.php';
require_once 'php/src/domain_invitations.php';
require_once 'php/src/util/address.php';

final class PhpSuite extends TestCase
{
    public function testCanCreateProduct()
    {
        new Product();
    }

    public function testCanCreateDomainInvitation()
    {
        $this->assertNotNull(new DomainInvitation());
    }

    public function testAddressCountry()
    {
        $this->assertEquals(address_country('AU'), 'Australia');
    }
}
