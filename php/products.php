<?php

require_once 'entity.php';
require_once 'categories.php';
require_once 'discount.php';
require_once 'domains.php';
require_once 'files.php';
require_once 'specifications.php';

class Product extends Entity
{
    public static $json_name = 'product';
    public static $resource = '/products/';


    public function __construct() {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('notes', 'string');
        $this->json_property('description', 'string');
        $this->json_property('unitPrice', 'float');
        $this->json_property('unitAmount', 'float');
        $this->json_property('bestPrice', 'float');
        $this->json_property('minimum', 'float');
        $this->json_property('unit_weight', 'float');
        $this->json_property('unit_height', 'float');
        $this->json_property('unit_width', 'float');
        $this->json_property('unit_depth', 'float');
        $this->json_property('unit_volume', 'float');
        $this->json_property('needs_drafting', 'boolean');
        $this->json_property('needs_production', 'boolean');
        $this->json_property('needs_shipping', 'boolean');
        $this->json_property('show_public', 'boolean');
        $this->json_property('accept_stripe', 'boolean');
        $this->json_property('accept_paypal', 'boolean');
        $this->json_property('accept_bank_transfer', 'boolean');
        $this->json_property('accept_phone_payment', 'boolean');
        $this->json_property('allow_payment_upfront', 'boolean');
        $this->json_property('allow_quotation', 'boolean');
        $this->json_property('delivery_days_normal', 'integer');
        $this->json_property('categories', 'Category', $many = True,
                             $recursive = True);
        $this->json_property('discounts', 'Discount', $many = True,
                             $recursive = True);
        $this->json_property('domain', 'Domain', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('files', 'File', $many = True,
                             $recursive = True);
        $this->json_property('independent_variation_fields', 'SpecificationField',
                             $many = True, $recursive = True);
        $this->json_property('group_variation_fields', 'SpecificationField',
                             $many = True, $recursive = True);
        $this->json_property('suppliers', 'User', $many = True,
                             $recursive = True);
    }
}

class Products_ extends Resource
{
    public function __construct() {
        $this->entity_class = 'Product';
        $this->json_name = 'products';
    }
}

$products = new Products_();
