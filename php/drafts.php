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
        parent::__construct();
        $this->json_property('id','integer');
        $this->json_property('job','Job', null,
                             False, $recursive = True);
        $this->json_property('designer','User', null,
                             False, $recursive = True);
        $this->json_property('file','File', null,
                             False, $recursive = True);
        $this->json_property('date', 'DateTime');
        $this->json_property('accepted', 'DateTime');
        $this->json_property('resend_date', 'DateTime');
        $this->json_property('send_sms','boolean');
        $this->json_property('send_email','boolean');
        $this->json_property('comments', 'DraftComment', null,
                             True, $recursive = True);
        $this->json_property('viewd','boolean');
        $this->json_property('just_viewed','boolean');
    }

      function changes_have_been_requested(){
          /* Return true if any changes to this draft have been requested
              (typically by the client), or False otherwise. Requires that the
              draft object was loaded with the draft commented embedded.
          */
          foreach($this->comments as $comment){
              if ($comment->change_request){
                  return True;
              }
              unset($comment);
          }
          return False;
      }

      function is_draft_rejected(){
          # Return True if the draft has been rejected else return False
          return $this->changes_have_been_requested();
      }

      function is_most_recent(){
          /*Return True if the draft is the most recent draft
              in the related job else return False
          */
          foreach($this->job->drafts as $draft){
              if ($this->date < $draft->date){
                  return False;
              }
          }
          return True;
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
