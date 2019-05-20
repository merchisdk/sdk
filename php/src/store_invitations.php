<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'stores.php';
require_once 'users.php';

class StoreInvitation extends Entity
{
    public static $resource = '/store_invitations/';
    public static $json_name = 'storeInvitation';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('user_name', 'string');
        $this->json_property('user_email', 'string');
        $this->json_property('role', 'integer');
        $this->json_property('store', 'Store', '',
                              $many = False, $recursive = True);
        $this->json_property('sender', 'User', '',
                              $many = False, $recursive = True);
        $this->json_property('user', 'User', '',
                             False, $recursive = True);
    }
}

class StoreInvitations extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'StoreInvitation';
        $this->json_name = 'storeInvitations';
    }
}

$store_invitations = new StoreInvitations();
