<?php

require_once 'entity.php';
require_once 'drafts.php';
require_once 'users.php';
require_once 'files.php';
require_once 'notifications.php';

class DraftComment extends Entity
{
    public static $resource = '/draft_comments/';
    public static $json_name = 'draft_comment';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('id','integer');
        $this->json_property('draft','Draft', null,
                              $many = False, $recursive = True);
        $this->json_property('job', 'Job', null,
                              False, $recursive = True);
        $this->json_property('user', 'User', null,
                             False, $recursive = True);
        $this->json_property('fowards', 'User', null,
                              $many = True, $recursive = True);
        $this->json_property('notifications', 'Notification', null,
                             True, $recursive = True);
        $this->json_property('urgency','integer');
        $this->json_property('subject','string');
        $this->json_property('date', 'DateTime');
        $this->json_property('text', 'string');
        $this->json_property('change_request', 'boolean');
        $this->json_property('send_sms', 'boolean');
        $this->json_property('send_email', 'boolean');
    }
}

class DraftComments extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'DraftComment';
        $this->json_name = 'draft_comments';
    }
}

$draft_comments = new DraftComments();
