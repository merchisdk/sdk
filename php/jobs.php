<?php

require_once 'entity.php';
require_once 'users.php';
require_once 'products.php';
require_once 'job_comments.php';
require_once 'draft_comments.php';
require_once 'production_comments.php';
require_once 'country_taxes.php';
require_once 'domains.php';
require_once 'drafts.php';
require_once 'invoices.php';
require_once 'files.php';
require_once 'addresses.php';
require_once 'bids.php';
require_once 'shipments.php';
require_once 'companies.php';
require_once 'specifications.php';
require_once 'notifications.php';

class Job extends Entity
{
    public static $json_name = 'Job';
    public static $resource = '/jobs/';


    public function __construct() {
        $this->escape_fields = ['product', 'quantity', 'tax_type'];
        $this->json_property('id', 'integer');
        $this->json_property('manager','User', $many = False,
                             $recursive = True);
        $this->json_property('designer','User', $many = False,
                             $recursive = True);
        $this->json_property('client','User', $many = False,
                             $recursive = True);
        $this->json_property('product','Product', $many = False,
                             $recursive = True);
        $this->json_property('comments','JobComment', $many = True,
                             $recursive = True);
        $this->json_property('draft_comments','DraftComment', $many = True,
                             $recursive = True);
        $this->json_property('drafts','Draft', $many = True,
                             $recursive = True);
        $this->json_property('invoice','Invoice', $many = False,
                             $recursive = True);
        $this->json_property('shipping','Address', $many = False,
                             $recursive = True);
        $this->json_property('production_shipping_address','Address', $many = False,
                             $recursive = True);
        $this->json_property('notifications','Notification', $many = True,
                             $recursive = True);
        $this->json_property('client_company','Company', $many = False,
                             $recursive = True);
        $this->json_property('quantity', 'integer');
        $this->json_property('notes', 'string');
        $this->json_property('production_notes', 'string');
        $this->json_property('completed', 'boolean');
        $this->json_property('archived', 'boolean');
        $this->json_property('priority', 'integer');
        $this->json_property('cost_per_unit', 'float');
        $this->json_property('tax_amount', 'float');
        $this->json_property('automatic_price_enabled', 'boolean');
        $this->json_property('cost', 'integer');
        $this->json_property('job_weight', 'float');
        $this->json_property('job_volume', 'float');
        $this->json_property('needs_production', 'boolean');
        $this->json_property('needs_drafting', 'boolean');
        $this->json_property('needs_shipping', 'boolean');
        $this->json_property('domain', 'string');
        $this->json_property('deadline', 'integer', $default = NULL);
        $this->json_property('production_status', 'integer');
        $this->json_property('design_status', 'integer');
        $this->json_property('shipping_status', 'integer');
        $this->json_property('payment_status', 'integer');
        $this->json_property('domain', 'string');]
        $this->json_property('received', 'DateTime');
        $this->json_property('deadline', 'DateTime');
        $this->json_property('updated', 'DateTime');
        $this->json_property('product', 'Product', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('domain', 'Domain', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('clientFile', 'File', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('productionFile', 'File', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('assignments', 'Assignment', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('specifications_groups', 'SpecificationsGroup', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('specifications', 'Specification', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('shipment', 'Shipment',
                             $many = False, $recursive = True);
        $this->json_property('tax_type', 'CountryTax',
                             $many = False, $recursive = True);
    }
}

class Jobs extends Resource
{
    public function __construct(argument)
    {
        $this->entity_class = 'Job';
        $this->json_name = 'jobs';
    }
}

class Assignment extends Entity
{
    public static $resource = '/assignments/';
    public static $json_name = 'assignment';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('manager_accepts', 'string');
        $this->json_property('supplier_refused', 'string');
        $this->json_property('production_deadline', 'DateTime');
        $this->json_property('assignment_deadline', 'DateTime');
        $this->json_property('job', 'Job',
                             $many = False, $recursive = True);
        $this->json_property('supplier', 'User',
                             $many = False, $recursive = True);
        $this->json_property('bid', 'Bid',
                             $many = False, $recursive = True);
        $this->json_property('comments', 'ProductionComment',
                             $many = True, $recursive = True);
        $this->json_property('shipment', 'Shipment',
                             $many = False, $recursive = True);
        $this->json_property('notifications', 'Notification',
                             $many = True, $recursive = True);
    }
}

class Assignments extends Resource
{
    public function __construct(argument)
    {
        $this->entity_class = 'Assignment';
        $this->json_name = 'assignments';
    }
}

$jobs = new Jobs();
$assignments = new Assignments();
