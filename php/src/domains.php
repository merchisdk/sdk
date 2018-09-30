<?php

require_once 'entity.php';
require_once 'products.php';

class Domain extends Entity
{
    public static $json_name = 'domain';
    public static $resource = '/domains/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('domain', 'string');
        $this->json_property('email_domain', 'string');
        $this->json_property('theme', 'string');
        $this->json_property('products', 'Product', null, $many = True,
                             $recursive = True);
    }
}

class Domains_ extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Domain';
        $this->json_name = 'domainss';
    }
}

$domains = new Domains_();
