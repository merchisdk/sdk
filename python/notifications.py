import datetime
import sdk.python.entities
import sdk.python.job_comments
import sdk.python.draft_comments
import sdk.python.production_comments
import sdk.python.users
import sdk.python.domains
import sdk.python.jobs
import sdk.python.files
import common.notification_sources as note_source
import common.notification_type as note_type
from common.brand_util import PLATFORM_MASCOT_ICON


class Notification(sdk.python.entities.Entity):

    resource = '/notifications/'
    json_name = 'notification'

    def __init__(self):
        super(Notification, self).__init__()

        self.json_property(int, 'id')
        self.recursive_json_property(sdk.python.users.User,
                                     'recipient')
        self.recursive_json_property(sdk.python.users.User,
                                     'sender')
        self.json_property(datetime.datetime, 'date')
        self.recursive_json_property(sdk.python.domains.Domain, 'domain')
        self.recursive_json_property(sdk.python.jobs.Job, 'related_job')
        self.recursive_json_property(sdk.python.job_comments.JobComment,
                                     'related_job_comment')
        self.recursive_json_property(sdk.python.draft_comments.DraftComment,
                                     'related_draft_comment')
        self.recursive_json_property(sdk.python.production_comments.
                                     ProductionComment,
                                     'related_production_comment')
        self.recursive_json_property(sdk.python.files.File,
                                     "attachment")
        self.json_property(bool, 'seen')
        self.json_property(bool, 'send_email')
        self.json_property(bool, 'send_sms')
        self.json_property(int, 'urgency')
        self.json_property(int, 'notification_type')
        self.json_property(str, 'description')
        self.json_property(str, 'subject')
        self.json_property(str, 'message')
        self.json_property(str, 'html_message')
        self.json_property(str, 'link')
        self.json_property(int, 'section')

    def have_link(self):
        return self.link and self.link.lower() != 'none'

    def can_reply(self, role):
        """ Check whether user the user has the right to reply to a
            notification.
        """
        if int(self.section) not in note_source.section_roles:
            return False
        elif role in note_source.section_roles[int(self.section)]:
            return True
        return False

    def notification_title(self):
        """ Check to see if notifications has a subject
            and return a special title if this is the case
        """
        if self.subject and self.subject != "None":
            if self.related_job:
                return "{0} - {1}".format(self.subject,
                                          self.domain.email_domain)
            return self.subject
        return self.description

    def job_notification_title(self):
        """ Check to see if notifications has a subject and return a
            a shorter job notification title specifically for jobs
        """
        if self.subject and self.subject != "None":
            return self.subject
        return self.description

    def avatar_url(self):
        """ Return the URL of the correct avatar to use for the
            notification
        """
        notification_type = self.notification_type
        sender = self.sender
        domain = self.domain
        if notification_type in note_type.SHOW_USER_AVATAR and sender:
            return sender.profile_picture_url(50)
        if notification_type in note_type.SHOW_DOMAIN_AVATAR and domain:
            return domain.logo_url()
        if notification_type in note_type.SHOW_USER_OR_DOMAIN_AVATAR:
            if sender:
                return sender.profile_picture_url(50)
            if domain:
                return domain.logo_url()
        if notification_type in note_type.SHOW_DOMAIN_OR_USER_AVATAR:
            if domain:
                return domain.logo_url()
            if sender:
                return sender.profile_picture_url(50)
        return PLATFORM_MASCOT_ICON


class Notifications(sdk.python.entities.Resource):

    entity_class = Notification
    json_name = 'notifications'


notifications = Notifications()
