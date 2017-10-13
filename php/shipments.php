<?php

require_once 'entity.php';
require_once 'addresses.php';
require_once 'users.php';
require_once 'companies.php';
require_once 'invoices.php';

class Category extends Entity
{
    public static $resource = '/shipments/';
    public static $json_name = 'shipment';

    public function __construct()
    {
        $this->escape_fields = ['tax_type'];

        $this->json_property('id','integer');
        $this->json_property('creation_date','DateTime');
        $this->json_property('dispatched_date','DateTime');
        $this->json_property('dispatch_date','DateTime');
        $this->json_property('expected_receive_date','DateTime');
        $this->json_property('received_date','DateTime');

        # sender attributes
        $this->json_property('sender', 'User', $many = False,
                             $recursive = True);
        $this->json_property('sender_company', 'Company', $many = False,
                             $recursive = True);
        $this->json_property('sender_address', 'Address', $many = False,
                             $recursive = True);
        $this->json_property('sender_notes', 'string');

        #receiver attributes
        $this->json_property('receiver', 'User', $many = False,
                             $recursive = True);
        $this->json_property('receiver_company', 'Company', $many = False,
                             $recursive = True);
        $this->json_property('receiver_address', 'Address', $many = False,
                             $recursive = True);
        $this->json_property('receiver_notes', 'string');

        $this->json_property('invoice', 'Invoice', $many = False,
                             $recursive = True);
        $this->json_property('jobs', 'Job', $many = True,
                             $recursive = True);
        $this->json_property('assignments', 'Assignment', $many = True,
                             $recursive = True);

        $this->json_property('tracking_number', 'string');
        $this->json_property('transport_company', 'string');
        $this->json_property('max_weight', 'float');
        $this->json_property('max_volume', 'float');
        $this->json_property('send_sms', 'boolean');
        $this->json_property('send_email', 'boolean');
        $this->json_property('sender_responsible', 'boolean');
        $this->json_property('cost', 'float');
        $this->json_property('tax_amount', 'float');
        $this->json_property('tax_type', 'CountryTax', $many = False,
                             $recursive = True);
    }
}

class Shipments extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Shipment';
        $this->json_name = 'shipments';
    }
}

$shipments = new Shipments();
