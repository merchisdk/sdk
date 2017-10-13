<?php

require_once 'entity.php';

class Category extends Entity
{
    public static $resource = '/categories/';
    public static $json_name = 'category';

    public function __construct()
    {
        $this->json_property('id','integer');
        $this->json_property('name','string');
        $this->json_property('show_dashboard','boolean');
        $this->json_property('show_public','boolean');
        $this->json_property('domain', 'Domain', $many = False,
                             $default = '1', $recursive = True);
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
