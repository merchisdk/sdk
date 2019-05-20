<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'products.php';

class Store extends Entity
{
    public static $json_name = 'store';
    public static $resource = '/stores/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('store', 'string');
        $this->json_property('store_type', 'integer');
        $this->json_property('email_store', 'string');
        $this->json_property('theme', 'string');
        $this->json_property('products', 'Product', null, $many = True,
                             $recursive = True);
    }
}

class Stores_ extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Store';
        $this->json_name = 'storess';
    }
}

$stores = new Stores_();
