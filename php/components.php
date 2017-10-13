<?php

require_once 'entity.php';
require_once 'component_tags.php';

class Component extends Entity
{
    public static $resource = '/components/';
    public static $json_name = 'component';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('body', 'string');
        $this->json_property('description', 'string');
        $this->json_property('tags', 'ComponentTag', $many = True,
                            $recursive = True);
    }
}

class Components extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Component';
        $this->json_name = 'components';
    }
}

$components = new Components();
