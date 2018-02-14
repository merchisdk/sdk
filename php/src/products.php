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
        parent::__construct();
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
        $this->json_property('categories', 'Category', null, $many = True,
                             $recursive = True);
        $this->json_property('discounts', 'Discount', null, $many = True,
                             $recursive = True);
        $this->json_property('domain', 'Domain', null, $many = False,
                             $recursive = True);
        $this->json_property('files', 'File', null, $many = True,
                             $recursive = True);
        $this->json_property('independent_variation_fields', 'SpecificationField',
                             null, $many = True, $recursive = True);
        $this->json_property('group_variation_fields', 'SpecificationField',
                             null, $many = True, $recursive = True);
        $this->json_property('suppliers', 'User', null, $many = True,
                             $recursive = True);
    }

    public function create($embed = null, $email = null,$password = null,
                          $query = null, $api_secret = null, $as_domain = null)
    {
        $this->unit_price = (float)$this->unit_price;
        parent::create($embed, $email,$password,
                      $query, $api_secret, $as_domain);
    }

    public function primary_image(){
        /*
          Return the first product image object if one exists and
          return None if no images exists
        */
        if($this->files and sizeof($this->files) > 0){
            return $this->files[0];
        }
        return null;
    }

    public function preview_images($max_images){
        /*Only will return max_images of files */
        return array_slice($this->files, 0, $max_images);
    }

    public function default_currency(){
        return $this->domain->company->default_currency;
    }

    public function primary_product_image(){
        /*Return the first product image if it exists else return None*/
        if($this->files and sizeof($this->files) > 0){
            $result = $this->files[0];
            return $result->view_url;
        }
        return null;
    }

    public function build_empty_specifications_group(){
        $specifications_group_built = new SpecificationsGroup();
        $specifications_group_built->quantity = 0;
        $specifications_group_built->specifications = [];
        $specifications_group_built->group_cost = 0;
        foreach($this->group_variation_fields as $specification_field){
            $empty_specification =
            $specification_field->build_empty_specification();
            $specifications_group_built->specifications[] =  $empty_specification;
            $specifications_group_built->group_cost +=
            $empty_specification->cost;
        }
        return $specifications_group_built;
    }

    public function build_empty_independent_specifications(){
        $result_array = [];
        foreach($this->independent_variation_fields as $field){
            $result_array[] = $field->build_empty_specification();
        }
        return $result_array;
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
