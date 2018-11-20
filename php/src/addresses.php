<?php
declare(strict_types=1);

require_once 'entity.php';

class Address extends Entity
{
    public static $json_name = 'address';
    public static $resource = '/addresses/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('line_one', 'string');
        $this->json_property('line_two', 'string');
        $this->json_property('city', 'string');
        $this->json_property('state', 'string');
        $this->json_property('country', 'string');
        $this->json_property('postcode', 'string');
    }
}
