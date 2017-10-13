<?php

require_once 'entity.php';

class Category extends Entity
{
    public static $resource = '/menus/';
    public static $json_name = 'menu';

    public function __construct()
    {
        $this->json_property('id','integer');
        $this->json_property('name','string');
        $this->json_property('menu_handle','string');
        $this->json_property('menu_type','integer');
        $this->json_property('menu_items', 'MenuItem', $many = True,
                             $recursive = True);
    }
}

class MenuItem extends Entity
{
    public function __construct()
    {
      $this->json_property('id','integer');
      $this->json_property('name','string');
      $this->json_property('link_url','string');
      $this->json_property('link_type','integer');
      $this->json_property('position','integer');
    }

    public function url($domain = Null){
      /*Check to see if the menu type is a redirect or an
            internal link, then return a full url constructed from the
            link_uri and the domain
      */
    }
}
