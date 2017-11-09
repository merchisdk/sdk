<?php

require_once 'entity.php';
require_once './../php_aux/menu_util.php';
require_once 'config.php';

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

    public function  menu_items_in_order(){
        #Return a list of menu_items sorted by their position
        $return_array = $this->menu_items;
        usort($return_array, function($a, $b){
            return $a->position <=> $b->postition;
        })
        return $return_array;
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
      $server_name = SERVER_NAME;
      if($domain and $this->link_type == INTERNAL_PAGE){
          $fmt = "http://%s.%s/%s/";
          return sprintf($fmt, (string)$domain->sub_domain, $server_name,
          $this->link_uri);
      }
      return $this->link_uri;
    }
}
