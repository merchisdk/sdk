<?php

require_once 'entity.php';

class Bank extends Entity
{
    public static $json_name = 'bank';
    public static $resource = '/banks/';


    public function __construct() {
        parent::__construct();
        $this->escape_fields = ['default'];
        $this->json_property('id', 'integer');
        $this->json_property('default','boolean');
        $this->json_property('bank_name', 'string');
        $this->json_property('account_number', 'string');
        $this->json_property('bsb', 'string');
        $this->json_property('swift_code', 'string');
        $this->json_property('iban', 'string');
        $this->json_property('bank_code', 'string');
        $this->json_property('bank_address', 'Address', '',
                             false, $recursive = True);
    }
}
