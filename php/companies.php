<?php

require_once 'entity.php';
#import sdk.python.country_taxes
/*from sdk.python.email_addresses import EmailAddress
from sdk.python.addresses import Address
from sdk.python.files import File
from sdk.python.phone_numbers import PhoneNumber
from sdk.python.banks import Bank
import sdk.python.users*/
require_once 'company_invitations.php';
require_once 'common_alt.php';

class Company extends Entity
{
    public static $json_name = 'company';
    public static $resource = '/companies/';
    public $default_banks = array();

    public function __construct() {
        #import sdk.python.company_invitations
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('website', 'string');
        $this->json_property('tax_number', 'string');
        $this->json_property('tax_number_type', 'integer');
        $this->json_property('default_currency', 'string');
        $this->json_property('paypal_account', 'string');
        $this->json_property('paypal_password', 'string');
        $this->json_property('paypal_signature', 'string');
        $this->json_property('is_paypal_valid', 'boolean');
        $this->json_property('stripe_publishable_key', 'string');
        $this->json_property('stripe_api_key', 'string');
        $this->json_property('is_stripe_valid', 'boolean');
        $this->json_property('accept_stripe', 'boolean');
        $this->json_property('accept_paypal', 'boolean');
        $this->json_property('accept_bank_transfer', 'boolean');
        $this->json_property('accept_phone_payment', 'boolean');
        $this->json_property('temporary_created', 'boolean');
        $this->json_property('logo', 'File', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('emailAddresses', 'EmailAddress', $many = True,
                             $recursive = True);
        $this->json_property('phoneNumbers', 'PhoneNumber', $many = True,
                             $recursive = True);
        $this->json_property('payment_phone_numbers', 'PhoneNumber',
                             $many = True, $recursive = True);
        $this->json_property('addresses', 'Address', $many = True,
                             $recursive = True);
        $this->json_property('user_companies', 'UserCompany', $many = True,
                             $recursive = True);
        $this->json_property('banks', 'Bank', $many = True,
                             $recursive = True);
        $this->json_property('company_invitations', 'CompanyInvitation',
                             $many = True, $recursive = True);
        $this->json_property('default_tax_type', 'CountryTax', $many = False,
                             $default = '1', $recursive = True);

    }

    #TODO:A lot of functions
    function get_default_banks(){
        foreach($this->banks as $bank){
            if ($bank->default){
              array_push($this->default_banks, $bank);
            }
        }
        unset($bank);
        return $this->default_banks;
    }

    function primary_address(){
        if ($this->address){
          return $this->address[0];
        } else{
          return null;
        }
    }

    function dictionary_of_address_names_and_ids(){
        #Return an array of dictionaries which contain the
        #name and id of the address which are related to this company.
        $saved_address = array();
        if ($this->addresses){
            foreach(array_values($this->addresses) as $i=>$address){
                $name = $address_util->name_primary($i, $this->name);
                $temp_address = array('name'=>$name,'id'=>$address->id);
                array_push($saved_address, $temp_address);
            }
        }
        return $saved_address;
    }

    function is_payment_phone_nubmer_valid(){
        return sizeof($this->payment_phone_numbers) > 0;
    }

    function is_bank_valid(){
        return sizeof($this->banks) > 0;
    }

    function primary_phone_number(){
        try {
            $primary_phone_number = $this->phone_numbers[0]->international_format_number;
        } catch (Exception $e) {
            $primary_phone_number = "";
        }
        return $primary_phone_number;

    }

    function primary_eamil_address(){
        try {
            $primary_eamil_address = $this->email_addresses[0]->emailAddress;
        } catch (Exception $e) {
            $primary_eamil_address = "";
        }
        return $primary_eamil_address;
    }
}

class Companies extends Resource
{

    public function __construct()
    {
        $this->entity_class = 'Company';
        $this->json_name = 'companies';
    }
}

$companies = new Companies();
