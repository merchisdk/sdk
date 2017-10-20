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
require_once './../php_aux/invoice_status.php';
require_once './../php_aux/money_protocol.php';

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

    function process_for_transfer(){
        # can not update product by updating invoice
        # will have better solution later
        if($this->jobs){
            foreach($this->jobs as $job){
                $job->product = null;
            }
        }
    }

    function amount_paid(){
        #Return how much money has been paid for this invoice.
        if (is_array($this->payments)){
            $sum = 0;
            foreach($this->payments as $key=>$value){
                $sum += $value->amount;
            }
            return $sum;
        } else{
            return 0;
        }
    }

    function amount_owed(){
        #Return how much money still owed for this invoice
        $total = $this->total_cost;
        if($this->amount_paid()){
            return $total - $this->amount_paid();
        } else{
            return $total;
        }
    }

    function amount_owed_format_with_currency(){
        /*Return a formatted amount owed including the currency
            icon at the start of the value.
        */
        return format_currency($this->amount_owed(), 2, $this->currency);
    }

    function invoice_payment_status(){
        #Return the payment status of the invoice
        $total_payment = 0;
        foreach($this->payments as $key=>$value){
            $total_payment += $value->amount;
        }

        if ($total_payment < 0){
            return NEGATIVE_PAYMENT;
        } elseif ($total_payment == 0) {
            return NO_PAYMENT;
        } elseif ($this->total_cost == $total_payment) {
            return FULL_PAYMENT;
        } elseif ($this->total_cost > $total_payment) {
            return PART_PAYMENT;
        } else {
            return OVER_PAYMENT;
        }
    }

    function is_paid_string(){
        /*Return a string 'Unpaid' if the invoice is unpaid
          else return a string 'Paid'.
        */
        if ($this->unpaid){
            return "Unpaid";
        } else{
            return "Paid";
        }
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
