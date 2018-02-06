<?php

require_once 'entity.php';
require_once 'companies.php';
require_once 'users.php';

class CompanyInvitation extends Entity
{
    public static $json_name = 'companyInvitation';
    public static $resource = '/company_invitations/';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('token', 'string');
        $this->json_property('user_name', 'string');
        $this->json_property('user_email', 'string');
        $this->json_property('invite_as_admin', 'boolean');
        $this->json_property('company', 'Company', '',
                             False, $recursive = True);
        $this->json_property('sender', 'User', '',
                             False, $recursive = True);
    }
}

class CompanyInvitations extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'CompanyInvitation';
        $this->json_name = 'companyInvitations';
    }
}

$company_invitations = new CompanyInvitations();
