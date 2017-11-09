<?php

require_once 'entity.php';
require_once 'job_comments.php';
require_once 'draft_comments.php';
require_once 'production_comments.php';
require_once 'users.php';
require_once 'domains.php';
require_once 'jobs.php';
require_once 'files.php';
require_once './../php_aux/notifcation_sources.php';
require_once './../php_aux/notification_type.php';
require_once './../php_aux/brand_util.php';

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

    public function have_link(){
        return $this->link and strtolower($this->link) != 'none';
    }

    public function can_reply($role){
        /*Check whether user the user has the right to reply to a
            notification.
        */
        if (array_key_exists((int)$this->section, section_roles)) {
            if(in_array($role,section_roles[(int)$this->section])){
                return True;
            }
        }
        return False;
    }

    public function notification_title(){
        /*Check to see if notifications has a subject
          and return a special title if this is the case
        */
        if($this->subject and $this->subject != "None"){
            if($this->related_job){
                $fmt = "%s - %s";
                return sprintf($fmt, $this->subject, $this->domain->email_domain);
            }
            return $this->subject;
        }
        return $this->description;
    }

    public function job_notification_title(){
        /*Check to see if notifications has a subject and return a
            a shorter job notification title specifically for jobs
        */
        if($this->subject and $this->subject != "None"){
            return $this->subject;
        }
        return $this->description;
    }

    public function avatar_url(){
        #Return the URL of the correct avatar to use for the notification
        $notification_type = $this->notification_type;
        $sender = $this->sender;
        $domain = $this->domain;
        if(in_array($notification_type, SHOW_USER_AVATAR) and $sender){
            return $sender->profile_picture_url(50);
        }
        if(in_array($notification_type, SHOW_DOMAIN_AVATAR) and $domain){
            return $domain->logo_url();
        }
        if(in_array($notification_type, SHOW_USER_OR_DOMAIN_AVATAR) and $domain){
            if($sender){
                return $sender->profile_picture_url(50);
            }
            if($domain){
                return $domain->logo_url();
            }
        }
        if(in_array($notification_type, SHOW_DOMAIN_OR_USER_AVATAR) and $domain){
            if($domain){
                return $domain->logo_url();
            }
            if($sender){
                return $sender->profile_picture_url(50);
            }
        }
        return PLATFORM_MASCOT_ICON;
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
