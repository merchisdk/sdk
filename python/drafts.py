import datetime
import sdk.python.entities
from sdk.python.files import File
from sdk.python.entities import Property
from sdk.python.draft_comments import DraftComment


class Draft(sdk.python.entities.Entity):

    resource = '/drafts/'
    json_name = 'draft'

    id = Property(int)
    images = Property(File)
    date = Property(datetime.datetime)
    accepted = Property(datetime.datetime)
    resend_date = Property(datetime.datetime)
    viewed = Property(bool)
    just_viewed = Property(bool)
    send_sms = Property(bool)
    send_email = Property(bool)
    changes_requested = Property(bool)
    comments = Property(DraftComment, backref="draft")
    comments_count = Property(int)

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
