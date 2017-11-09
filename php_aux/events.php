<?php

const TYPE = 'type';
const _OBJECT = 'object';

const DRAFT_UPLOADED = 1;
const DRAFT_COMMENT = 2;
const DRAFT_REJECTED = 3;
const DRAFT_APPROVED = 4;
const DRAFT_RESENT = 5;

const JOB_COMMENT = 6;

class Event
{
    #Record the event type and event object for the timeline

    function __construct($event_type, $event_object)
    {
        $this->type = $event_type;
        $this->object = $event_object;
    }
}
