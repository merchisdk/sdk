<?php

require_once 'entity.php';
require_once 'invoices.php';
require_once 'users.php';
require_once './../php_aux/business_default.php';

class Payment extends Entity
{
    public static $resource = '/payments/';
    public static $json_name = 'payment';

    public function __construct()
    {
        $this->escape_fields = ['payment_type', 'pay_date'];
        $this->json_property('id','integer');
        $this->json_property('note','string');
        $this->json_property('payment_type','integer');
        $this->json_property('pay_date','DateTime');
        $this->json_property('amount','float');
        $this->json_property('invoice', 'Invoice', $many = False,
                             $recursive = True);
        $this->json_property('payment_recorder', 'Users', $many = False,
                             $recursive = True);
        $this->json_property('send_sms','boolean');
        $this->json_property('send_email','boolean');
    }

    public function payment_type_string(){
        /*Return the string value of payment type from the
          common.business_default file
        */
        return PAYMENT_TYPES[$this->payment_type];
    }
}

class Payments extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Payment';
        $this->json_name = 'payments';
    }
}

$payments = new Payments();
