<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'domains.php';
require_once 'users.php';

class DraftTemplate extends Entity
{
    public static $resource = '/draft_templates/';
    public static $json_name = 'draft_template';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('date', 'integer');
        $this->json_property('description', 'string');
        $this->json_property('name', 'string');
        $this->json_property('height', 'float');
        $this->json_property('width', 'float');

        $this->json_property('product', 'Product',
            $many = False, $recursive = True);
        $this->json_property('file', 'MerchiFile',
            $many = False, $recursive = True);
        $this->json_property('job', 'Job',
            $many = False, $recursive = True);
    }
}


