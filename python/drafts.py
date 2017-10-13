import datetime
import sdk.python.entities
import sdk.python.draft_comments
import sdk.python.jobs
import sdk.python.users
from sdk.python.files import File


class Draft(sdk.python.entities.Entity):


    resource = '/drafts/'
    json_name = 'draft'

    def __init__(self):
        super(Draft, self).__init__()

        self.json_property(int, 'id')
        self.recursive_json_property(sdk.python.jobs.Job,
                                     'job')
        self.recursive_json_property(sdk.python.users.User,
                                     'designer')
        self.recursive_json_property(File, 'file')
        self.json_property(datetime.datetime, 'date')
        self.json_property(datetime.datetime, 'accepted')
        self.json_property(datetime.datetime, 'resend_date')
        self.json_property(bool, 'viewed')
        self.json_property(bool, 'just_viewed')
        self.recursive_json_property(sdk.python.draft_comments.DraftComment,
                                     'comments')
        self.json_property(bool, 'send_sms')
        self.json_property(bool, 'send_email')

    def changes_have_been_requested(self):
        """ Return true if any changes to this draft have been requested
            (typically by the client), or False otherwise. Requires that the
            draft object was loaded with the draft commented embedded.
        """
        return any(comment.change_request for comment in self.comments)

    def is_draft_rejected(self):
        """ Return True if the draft has been rejected else False.  """
        return self.changes_have_been_requested()

    def is_most_recent(self):
        """ Return True if the draft is the most recent draft
            in the related job else return False
        """
        return not any(self.date < draft.date for draft in self.job.drafts)


class Drafts(sdk.python.entities.Resource):

    entity_class = Draft
    json_name = 'drafts'


drafts = Drafts()
