<?php

require_once 'entity.php';

class Job extends Entity
{
    public static $json_name = 'Job';
    public static $resource = '/jobs/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('quantity', 'integer');
        $this->json_property('notes', 'string');
        $this->json_property('cost', 'integer');
        $this->json_property('gst', 'integer');
        $this->json_property('domain', 'string');
        $this->json_property('deadline', 'integer', $default = NULL);
        $this->json_property('production_status', 'integer');
        $this->json_property('design_status', 'integer');
        $this->json_property('shipping_status', 'integer');
        $this->json_property('payment_status', 'integer');
        $this->json_property('product', 'Product', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('domain', 'Domain', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('clientFile', 'File', $default = [],
                             $many = true, $recursive = True);
    }
}
