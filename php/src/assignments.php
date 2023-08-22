<?php
declare(strict_types=1);

require_once 'entity.php';

class Assignment extends Entity
{
    public static $json_name = 'assignment';
    public static $resource = '/assignments/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('manager_accepts', 'integer');
        $this->json_property('supplier_refused', 'integer');
        $this->json_property('needs_drafting', 'boolean');
        $this->json_property('needs_shipping', 'boolean');
        $this->json_property('production_deadline', 'integer');
        $this->json_property('assignment_deadline', 'integer');
        $this->json_property('notes', 'string');
        $this->json_property('job', 'Job', $many = False,
            $recursive = True);
        $this->json_property('supply_job', 'Job', $many = False,
            $recursive = True);
        $this->json_property('supplier', 'User', $many = False,
            $recursive = True);
        $this->json_property('quote', 'Quote', $many = False,
            $recursive = True);
        $this->json_property('comments', 'ProductionComment', $many = True,
            $recursive = True);
        $this->json_property('shipment', 'Shipment', $many = False,
            $recursive = True);
        $this->json_property('supply_domain', 'SupplyDomain', $many = False,
            $recursive = True);
        $this->json_property('notifications', 'Notification', $many = True,
            $recursive = True);
        $this->json_property('production_files', 'MerchiFile', $many = True,
            $recursive = True);
    }


}
