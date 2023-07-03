<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'domains.php';
require_once 'users.php';

class DomainTag extends Entity
{
    public static $resource = '/domain_tags/';
    public static $json_name = 'domain_tag';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('colour', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('description', 'string');
        $this->json_property('show_public', 'boolean');
        $this->json_property('domain', 'Domain', '',
            $many = False, $recursive = True);
        $this->json_property('jobs', 'Job', '',
            $many = True, $recursive = True);
        $this->json_property('products', 'Product', '',
            $many = True, $recursive = True);
        $this->json_property('invoices', 'Job', '',
            $many = True, $recursive = True);
        $this->json_property('shipments', 'Shipment', '',
            $many = True, $recursive = True);
    }
}


