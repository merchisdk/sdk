<?php

require_once 'entity.php';
require_once 'users.php';
require_once 'files.php';
require_once 'jobs.php';
require_once 'notifications.php';

class JobComment extends Entity
{
    public static $resource = '/job_comments/';
    public static $json_name = 'job_comment';

    public function __construct()
    {
        $this->json_property('id','integer');
        $this->json_property('text','string');
        $this->json_property('urgency','integer');
        $this->json_property('subject', 'string');
        $this->json_property('send_sms','boolean');
        $this->json_property('send_email','boolean');
        $this->json_property('date', 'DateTime');
        $this->json_property('notifications', 'Notification', $many = True,
                              $recursive = True);
        $this->json_property('job', 'Job', $many = False,
                              $recursive = True);
        $this->json_property('user', 'User', $many = False,
                              $recursive = True);
        $this->json_property('fowards', 'User', $many = True,
                              $recursive = True);
        $this->json_property('file', 'File', $many = False,
                              $recursive = True);
    }
}

class JobComments extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'JobComment';
        $this->json_name = 'jobComments';
    }
}

$job_comments = new JobComments();
