<?php
declare(strict_types = 1);

use PHPUnit\Framework\TestCase;

require_once 'php/src/products.php';
require_once 'php/src/backups.php';
require_once 'php/src/bank.php';

final class PhpSuite extends TestCase
{
    public function testCanCreateProduct()
    {
        new Product();
    }

    public function testCanCreateBackup()
    {
        $this->assertNotNull(new Backup());
    }

    public function testCanCreateBank()
    {
        $this->assertNotNull(new Bank());
    }
}
