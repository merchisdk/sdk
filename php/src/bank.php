<?php
declare(strict_types=1);

require_once 'entity.php';

class Bank extends Entity
{
    public static $json_name = 'bank';
    public static $resource = '/banks/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('bank_name', 'string');
        $this->json_property('account_number', 'string');
        $this->json_property('bsb', 'string');
        $this->json_property('swift_code', 'string');
        $this->json_property('iban', 'string');
        $this->json_property('bank_code', 'string');
        $this->json_property('bank_address', 'Address', $many = True,
                             $recursive = True);
        $this->json_property('company', 'Company', $many = False,
                             $recursive = True);
    }
}
