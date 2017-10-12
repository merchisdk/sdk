TYPE = 'type'
OBJECT = 'object'

DRAFT_UPLOADED = 1
DRAFT_COMMENT = 2
DRAFT_REJECTED = 3
DRAFT_APPROVED = 4
DRAFT_RESENT = 5

JOB_COMMENT = 6


class Event(object):
    """ Record the event type and event object for the timeline """

    def __init__(self, event_type, event_object):
        self.type = event_type
        self.object = event_object
