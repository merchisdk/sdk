<?php

require_once 'entity.php';
require_once 'users.php';
require_once 'files.php';
require_once 'jobs.php';
require_once 'notifications.php';

class ProductionComment extends Entity
{
    public static $resource = '/production_comments/';
    public static $json_name = 'production_comment';

    public function __construct()
    {
        $this->json_property('id','integer');
        $this->json_property('assignment', 'Assignment', $many = False,
                             $recursive = True);
        $this->json_property('user', 'User', $many = False,
                             $recursive = True);
        $this->json_property('forwards', 'User', $many = True,
                             $recursive = True);
        $this->json_property('file', 'File', $many = False,
                             $recursive = True);
        $this->json_property('notifications', 'Notification', $many = True,
                             $recursive = True);
        $this->json_property('text','string');
        $this->json_property('date','DateTime');
        $this->json_property('urgency','integer');
        $this->json_property('subject','string');
        $this->json_property('is_urgent_question','boolean');
        $this->json_property('send_sms','boolean');
        $this->json_property('send_email','boolean');
    }
}

class ProductionComments extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'ProductionComment';
        $this->json_name = 'productionComments';
    }
}

$production_comments = new ProductionComments();
