<?php

require_once 'entity.php';
require_once 'jobs.php';
require_once 'payments.php';
require_once 'items.php';
require_once 'addresses.php';
require_once 'domains.php';
require_once 'users.php';
require_once 'files.php';
require_once 'companies.php';
require_once 'phone_numbers.php';
require_once 'email_addresses.php';

class Invoice extends Entity
{
    public static $resource = '/invoices/';
    public static $json_name = 'invoice';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('creation_date', 'DateTime');
        $this->json_property('payment_deadline', 'DateTime');
        $this->json_property('reminded', 'DateTime');
        $this->json_property('note', 'string');
        $this->json_property('send_sms','boolean');
        $this->json_property('send_email','boolean');
        $this->json_property('accept_stripe', 'boolean');
        $this->json_property('accept_paypal', 'boolean');
        $this->json_property('unpaid', 'boolean');
        $this->json_property('accept_bank_transfer', 'boolean');
        $this->json_property('accept_phone_payment', 'boolean');
        $this->json_property('is_remindable', 'boolean');
        $this->json_property('force_reminders', 'boolean');
        $this->json_property('total_cost', 'float');
        $this->json_property('subtotal_cost', 'float');
        $this->json_property('tax_amount', 'float');
        $this->json_property('currency', 'string');
        $this->json_property('invoice_token', 'string');
        $this->json_property('reminder_message', 'string');
        $this->json_property('responsible_manager','User', $many = False,
                             $recursive = True);
        $this->json_property('creator','User', $many = False,
                             $recursive = True);
        $this->json_property('client','User', $many = False,
                             $recursive = True);
        $this->json_property('client_phone','PhoneNumber', $many = False,
                             $recursive = True);
        $this->json_property('client_email','EmailAddress', $many = False,
                             $recursive = True);
        $this->json_property('jobs','Job', $many = True,
                             $recursive = True);
        $this->json_property('client_company','Company', $many = False,
                             $recursive = True);
        $this->json_property('client_company_phone','PhoneNumber', $many = False,
                             $recursive = True);
        $this->json_property('client_company_email','EmailAddress', $many = False,
                             $recursive = True);
        $this->json_property('items','Item', $many = True,
                             $recursive = True);
        $this->json_property('shipping','Address', $many = False,
                             $recursive = True);
        $this->json_property('pdf','File', $many = False,
                             $recursive = True);
        $this->json_property('receipt','File', $many = False,
                             $recursive = True);
        $this->json_property('domain', 'Domain', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('payments','Payment', $many = True,
                             $recursive = True);
    }
}

class Invoices extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Invoice';
        $this->json_name = 'invoices';
    }
}

$invoices = new Invoices();
