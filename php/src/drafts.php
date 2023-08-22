<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'domains.php';
require_once 'users.php';

class Draft extends Entity
{
    public static $resource = '/drafts/';
    public static $json_name = 'draft';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('date', 'integer');
        $this->json_property('accepted', 'integer');
        $this->json_property('resend_date', 'integer');
        $this->json_property('viewed', 'boolean');
        $this->json_property('send_sms', 'boolean');
        $this->json_property('send_email', 'boolean');
        $this->json_property('comments_count', 'integer');
        $this->json_property('changes_requested', 'boolean');

        $this->json_property('description', 'string');
        $this->json_property('show_public', 'boolean');
        $this->json_property('comments', 'DraftComment', '',
            $many = True, $recursive = True);

        $this->json_property('designer', 'User', '',
            $many = False, $recursive = True);
        $this->json_property('images', 'MerchiFile', '',
            $many = True, $recursive = True);
        $this->json_property('notification', 'Notification', '',
            $many = True, $recursive = True);
        $this->json_property('job', 'Job', '',
            $many = False, $recursive = True);
        $this->json_property('shared_with_job', 'Job', '',
            $many = False, $recursive = True);
    }

    public function were_changes_requested()
    {
        if (is_null($this->comments)) {
            throw new Exception('comments is undefined. did you forget to embed it?');
        }

        foreach ($this->comments as $comment) {
            if (is_null($comment->change_request)) {
                throw new Exception('changeRequest is undefined.');
            }
            if ($comment->change_request) {
                return True;
            }
        }
        return False;
    }

    function cmp($a, $b)
    {
        return $a->id - $b->id;
    }

    public function comments_youngest_to_eldest()
    {
        if (is_null($this->comments)) {
            throw new Exception('comments is undefined. did you forget to embed it?');
        }

        $result = $this->comments;
        usort($result, "cmp");
        return $result;
    }
}


