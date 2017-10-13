<?php

require_once 'entity.php';
require_once 'draft_comments.php';
require_once 'jobs.php';
require_once 'users.php';
require_once 'files.php';

class Draft extends Entity
{
    public static $resource = '/drafts/';
    public static $json_name = 'draft';

    public function __construct()
    {
        $this->json_property('id','integer');
        $this->json_property('job','Job', $many = False,
                             $recursive = True);
        $this->json_property('designer','User', $many = False,
                             $recursive = True);
        $this->json_property('file','File', $many = False,
                             $recursive = True);
        $this->json_property('date', 'DateTime');
        $this->json_property('accepted', 'DateTime');
        $this->json_property('resend_date', 'DateTime');
        $this->json_property('send_sms','boolean');
        $this->json_property('send_email','boolean');
        $this->json_property('comments', 'DraftComment', $many = Ture,
                             $recursive = True);
        $this->json_property('viewd','boolean');
        $this->json_property('just_viewed','boolean');
    }
}

class Drafts extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Draft';
        $this->json_name = 'drafts';
    }
}

$drafts = new Drafts();
