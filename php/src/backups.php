<?php

require_once 'entity.php';

class Backup extends Entity
{
    public static $resource = '/backups/';
    public static $json_name = 'backup';

    public function __construct() {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('file', 'File', '',
                             false, $recursive = True);
    }
}

class Backups extends Resource
{
    public function __construct() {
        $this->entity_class = 'Backup';
        $this->json_name = 'backups';
    }
}

$backups = new Backups();
