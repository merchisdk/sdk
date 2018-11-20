<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'domains.php';
require_once 'users.php';

class DomainInvitation extends Entity
{
    public static $resource = '/domain_invitations/';
    public static $json_name = 'domainInvitation';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('user_name', 'string');
        $this->json_property('user_email', 'string');
        $this->json_property('role', 'integer');
        $this->json_property('domain', 'Domain', '',
                              $many = False, $recursive = True);
        $this->json_property('sender', 'User', '',
                              $many = False, $recursive = True);
        $this->json_property('user', 'User', '',
                             False, $recursive = True);
    }
}

class DomainInvitations extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'DomainInvitation';
        $this->json_name = 'domainInvitations';
    }
}

$domain_invitations = new DomainInvitations();
