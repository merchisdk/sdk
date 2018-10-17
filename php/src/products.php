<?php

require_once 'entity.php';

class Product extends Entity
{
    public static $json_name = 'product';
    public static $resource = '/products/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('notes', 'string');
        $this->json_property('unitPrice', 'integer');
        $this->json_property('bestPrice', 'integer');
        $this->json_property('minimum', 'integer');
    }
}

class Products_ extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Product';
        $this->json_name = 'products';
    }
}

$products = new Products_();
