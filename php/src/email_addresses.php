<?php
declare(strict_types=1);

require_once 'entity.php';

class EmailAddress extends Entity
{
    public static $json_name = 'emailAddress';
    public static $resource = '/email_addresses/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('emailAddress', 'string');
        $this->json_property('users', 'User',
            $many = True, $recursive = True);
        $this->json_property('companies', 'Company',
            $many = True, $recursive = True);
    }
}
