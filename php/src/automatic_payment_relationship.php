<?php
declare(strict_types=1);

require_once 'entity.php';

class AutomaticPaymentRelationship extends Entity
{
    public static $json_name = 'automatic_payment_relationship';
    public static $resource = '/automatic_payment_relationships/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('creation_date', 'integer');
        $this->json_property('stripe_customer_id', 'string');

        $this->json_property('company_customer', 'Company', $many = False,
            $recursive = True);
        $this->json_property('company_supplier', 'Company', $many = False,
            $recursive = True);
    }
}
