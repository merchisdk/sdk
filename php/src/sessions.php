<?php

require_once 'entity.php';
require_once 'users.php';
require_once 'domains.php';

function years_to_seconds($years){
    return $years * 3.15569e7;
}

class Session extends Entity
{
    public static $resource = '/sessions/';
    public static $json_name = 'session';
    public static $primary_key = 'token';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('ip','string');
        $this->json_property('token','string');
        $this->json_property('remember','boolean');
        $this->json_property('user', 'User', null, $many = False,
                             $recursive = True);
        $this->json_property('domain', 'Domain', null, $many = False,
                             $recursive = True);
    }

    public function cookie_ttl(){
        if ($this->remember){
            return years_to_seconds(2);
        }
        else {
            return Null;
        }
    }
}

class Sessions extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Session';
        $this->json_name = 'sessions';
    }
}

$sessions = new Sessions();
