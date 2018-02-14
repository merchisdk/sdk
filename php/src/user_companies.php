<?php

require_once 'entity.php';
require_once 'companies.php';
require_once 'users.php';

class UserCompany extends Entity
{
    public static $resource = '/user_companies/';
    public static $json_name = 'userCompany';

    public function __construct()
    {
        parent::__construct();
        $this->escape_fields = ['main', 'is_admin'];
        $this->json_property('main','boolean');
        $this->json_property('is_admin','boolean');
        $this->json_property('show_dashboard','boolean');
        $this->json_property('show_public','boolean');
        $this->json_property('company', 'Company', null, $many = False,
                              $recursive = True);
        $this->json_property('user', 'User', null, $many = False,
                              $recursive = True);
    }
}

class UserCompanies extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'UserCompany';
        $this->json_name = 'userCompanies';
    }
}

$user_companies = new UserCompanies();
