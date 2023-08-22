<?php
declare(strict_types=1);

require_once 'entity.php';

class Category extends Entity
{
    public static $resource = '/categories/';
    public static $json_name = 'category';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('show_dashboard', 'boolean');
        $this->json_property('show_public', 'boolean');
        $this->json_property('show_public_supplier_resell', 'boolean');

        $this->json_property('domain', 'Domain', '',
            $many = False, $recursive = True);
        $this->json_property('products', 'Product', '',
            $many = True, $recursive = True);
        $this->json_property('users', 'User', '',
            $many = True, $recursive = True);
    }
}

class Categories extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Category';
        $this->json_name = 'categories';
    }
}

$categories = new Categories();
