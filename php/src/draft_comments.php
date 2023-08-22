<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'domains.php';
require_once 'users.php';

class DraftComment extends Entity
{
    public static $resource = '/draft_comments/';
    public static $json_name = 'draft_comment';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('date', 'integer');
        $this->json_property('urgency', 'integer');
        $this->json_property('text', 'string');
        $this->json_property('change_request', 'boolean');
        $this->json_property('send_sms', 'boolean');
        $this->json_property('send_email', 'boolean');

        $this->json_property('user', 'User',
            $many = False, $recursive = True);
        $this->json_property('file', 'MerchiFile',
            $many = False, $recursive = True);
        $this->json_property('forwards', 'User',
            $many = True, $recursive = True);
        $this->json_property('notifications', 'Notification',
            $many = True, $recursive = True);
        $this->json_property('draft', 'Draft',
            $many = False, $recursive = True);
        $this->json_property('job', 'Job',
            $many = False, $recursive = True);
    }
}


