<?php

require_once 'entity.php';
require_once 'job_comments.php';
require_once 'draft_comments.php';
require_once 'production_comments.php';
require_once 'users.php';
require_once 'domains.php';
require_once 'jobs.php';
require_once 'files.php';

class Category extends Entity
{
    public static $resource = '/notifications/';
    public static $json_name = 'notification';

    public function __construct()
    {
        $this->json_property('id','integer');
        $this->json_property('recipient', 'User', $many = False,
                             $recursive = True);
        $this->json_property('sender', 'User', $many = False,
                             $recursive = True);
        $this->json_property('date', 'DateTime');
        $this->json_property('related_job', 'Job', $many = True,
                             $recursive = True);
        $this->json_property('related_job_comment', 'JobComment', $many = False,
                             $recursive = True);
        $this->json_property('related_draft_comment', 'DraftComment', $many = False,
                             $recursive = True);
        $this->json_property('related_production_comment', 'ProductionComment', $many = False,
                             $recursive = True);
        $this->json_property('attachment', 'File', $many = False,
                             $recursive = True);
        $this->json_property('urgency','integer');
        $this->json_property('notification_type','integer');
        $this->json_property('seen','boolean');
        $this->json_property('send_email','boolean');
        $this->json_property('send_sms','boolean');
        $this->json_property('description','string');
        $this->json_property('subject','string');
        $this->json_property('message','string');
        $this->json_property('html_message','string');
        $this->json_property('link','string');
        $this->json_property('section','integer');
        $this->json_property('domain', 'Domain', $many = False,
                             $default = '1', $recursive = True);
    }
}

class Notifications extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Notification';
        $this->json_name = 'notifications';
    }
}

$notifications = new Notifications();
