<?php
declare(strict_types=1);

require_once 'entity.php';

class ComponentTag extends Entity
{
    public static $json_name = 'componentTag';
    public static $primary_key = 'name';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
    }
}
